"use client"

import { Send, RefreshCw, MessageCircle, Mic, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import { useEffect, useRef, useState } from "react"

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onend: () => void;
}

// VoiceButton Component
interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

function VoiceButton({ onTranscript, disabled }: VoiceButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<ISpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition() as ISpeechRecognition;
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          if (event.results[0].isFinal) {
            onTranscript(transcript);
            setIsListening(false);
            recognition.stop();
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognition);
      }
    }
  }, [onTranscript]);

  const toggleListening = () => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  if (!recognition) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleListening}
      disabled={disabled}
      className={`rounded-full transition-all duration-200 ${
        isListening 
          ? 'bg-[rgb(82,102,255)] text-white hover:bg-[rgb(82,102,255)]/90' 
          : 'bg-white hover:bg-gray-50'
      }`}
    >
      {isListening ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
      <span className="sr-only">
        {isListening ? 'Stop recording' : 'Start recording'}
      </span>
    </Button>
  );
}

// Chat Interface Props
interface ChatInterfaceProps {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  inputMessage: string;
  isTyping: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: (directMessage?: string) => void;
  onStartNewChat: () => void;
  quickPrompts: string[];
  chatTitle: string;
  chatSubtext?: string;
}

export function ChatInterface({
  messages,
  inputMessage,
  isTyping,
  onInputChange,
  onSendMessage,
  onStartNewChat,
  quickPrompts,
  chatTitle,
  chatSubtext,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(messages.length);

  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current || isTyping) {
      if (messagesContainerRef.current && messagesEndRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages, isTyping]);

  const handleQuickPrompt = (prompt: string) => {
    onSendMessage(prompt);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[800px] bg-white rounded-xl shadow-md">
      {/* Rest of your JSX remains the same */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[rgba(82,102,255,0.15)] to-[rgba(82,102,255,0.05)] rounded-t-xl border-b border-[rgba(82,102,255,0.1)]">
        <div className="flex items-center space-x-3">
          <MessageCircle className="w-6 h-6 text-[rgb(82,102,255)]" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{chatTitle}</h2>
            <p className="text-sm text-gray-600">{chatSubtext}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onStartNewChat}
          className="bg-white text-[rgb(82,102,255)] border-[rgb(82,102,255)] hover:bg-[rgba(82,102,255,0.1)] transition-colors duration-200"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-[500px]">
        {messages.map((message, index) => (
          <ChatMessage key={index} role={message.role} content={message.content} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 pt-8 border-t border-gray-200 bg-gray-50 mt-auto rounded-b-xl">
        <div className="flex flex-wrap gap-2 mb-3">
          {quickPrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickPrompt(prompt)}
              className="text-sm bg-white hover:bg-gray-50 border-gray-200"
            >
              {prompt}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[rgb(82,102,255)] focus:border-transparent bg-white"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <VoiceButton 
            onTranscript={(text) => {
              onInputChange(text);
            }}
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            className="rounded-full bg-[rgb(82,102,255)] hover:bg-[rgb(82,102,255)]/90 text-white px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 text-gray-400 h-8 px-3">
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-150" />
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-300" />
    </div>
  );
}

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  const formatContent = (text: string) => {
    return text
      .replace(/^-(?=\S)/gm, "- ")
      .replace(/\n-/g, "\n\n-")
      .replace(/\*\*(\S+)\*\*/g, "**$1**")
      .replace(/\n\n+/g, "\n\n")
      .trim();
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[85%] rounded-2xl px-4 py-2.5
          ${isUser ? "bg-[rgb(82,102,255)] text-white" : "bg-gray-100 text-gray-800"}
        `}
      >
        <div className="text-sm leading-relaxed">
          <ReactMarkdown
            components={{
              pre: ({ children }) => <div className="whitespace-pre-wrap">{children}</div>,
              code: ({ children }) => <code className="px-1 py-0.5 rounded-md bg-gray-200">{children}</code>,
            }}
            className={`
              markdown-content
              ${isUser ? "text-white" : "text-gray-800"}
              [&_p]:mb-2
              [&_p:last-child]:mb-0
              [&_ul]:mt-1
              [&_ul]:mb-2
              [&_li]:ml-4
              [&_li]:pl-1
              [&_strong]:font-semibold
              ${isUser ? "[&_strong]:text-white" : "[&_strong]:text-gray-900"}
            `}
          >
            {formatContent(content)}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export { ChatMessage };

"use client";

import { Send, RefreshCw, MessageCircle, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { useEffect, useRef, useState, useCallback } from "react";
import VoiceButton from "./VoiceButton";
import RealtimeVoiceChat from "./RealtimeVoiceChat"; // Import the realtime component
import {
  WordTiming,
  TTSResponse,
  TTS_CONSTANTS,
  AudioPlaybackState,
  TTSMetadata,
} from "@/types/tts";
import { PolicyDashboard } from "@/app/dashboard/page";

interface ChatInterfaceProps {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  inputMessage: string;
  isTyping: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: (userMessage?: string, assistantMessage?: string) => void;
  onStartNewChat: () => void;
  quickPrompts: string[];
  chatTitle: string;
  chatSubtext?: string;
  policyData?: PolicyDashboard | null;
  userEmail?: string;
}

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isCurrentlyPlaying?: boolean;
}

const ChatInterface = ({
  messages,
  inputMessage,
  isTyping,
  onInputChange,
  onSendMessage: parentOnSendMessage,
  onStartNewChat,
  quickPrompts,
  chatTitle,
  chatSubtext,
  policyData,
  userEmail = "default@user.com",
}: ChatInterfaceProps) => {
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(messages.length);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wordTimingsRef = useRef<WordTiming[]>([]);
  const startTimeRef = useRef(0);
  const lastWordIndexRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const audioPositionRef = useRef(0);

  // State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAudioPaused, setIsAudioPaused] = useState(false);
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const [currentSpeakingText, setCurrentSpeakingText] = useState("");
  const [displayText, setDisplayText] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_audioMetadata, setAudioMetadata] = useState<TTSMetadata | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_playbackState, setPlaybackState] = useState<AudioPlaybackState>({
    isPlaying: false,
    isPaused: false,
    currentTime: 0,
    duration: 0,
  });
  const [showRealtimeChat, setShowRealtimeChat] = useState(false);

  // Text display update function
  const updateDisplayText = useCallback(
    (currentTime: number) => {
      const timings = wordTimingsRef.current;
      if (!timings.length) return;

      let text = "";
      let updatedLastIndex = lastWordIndexRef.current;
      const elapsedTime = currentTime - startTimeRef.current;

      for (let i = 0; i < timings.length; i++) {
        const timing = timings[i];
        const adjustedStart =
          timing.start + TTS_CONSTANTS.WORD_TRANSITION_BUFFER;
        if (elapsedTime >= adjustedStart) {
          text += (i > 0 ? " " : "") + timing.word;
          updatedLastIndex = i;
        } else {
          break;
        }
      }

      if (updatedLastIndex > lastWordIndexRef.current) {
        lastWordIndexRef.current = updatedLastIndex;
        setDisplayText(text);
      }

      const lastTiming = timings[timings.length - 1];
      if (
        elapsedTime <
        lastTiming.start +
          lastTiming.duration +
          TTS_CONSTANTS.WORD_TRANSITION_BUFFER
      ) {
        animationFrameRef.current = requestAnimationFrame(() =>
          updateDisplayText(performance.now())
        );
      } else {
        setDisplayText(currentSpeakingText); // Show full text when complete
      }
    },
    [currentSpeakingText]
  );

  // TTS handling
  const handleTextToSpeech = useCallback(async (text: string) => {
    try {
      if (!text.trim()) return;

      // Reset state
      setCurrentSpeakingText(text);
      setDisplayText("");
      lastWordIndexRef.current = 0;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Clear existing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TTSResponse = await response.json();
      const { audio: audioBase64, timings, metadata } = data;

      setAudioMetadata(metadata);

      const audioBlob = new Blob([Buffer.from(audioBase64, "base64")], {
        type: "audio/mp3",
      });
      const audioUrl = URL.createObjectURL(audioBlob);

      const currentAudioRef = audioRef.current;
      if (currentAudioRef) {
        currentAudioRef.src = audioUrl;
        wordTimingsRef.current = timings;

        // Add preload delay
        await new Promise((resolve) =>
          setTimeout(resolve, TTS_CONSTANTS.AUDIO_PRELOAD_DELAY)
        );

        try {
          await currentAudioRef.play();
          setPlaybackState((prev) => ({
            ...prev,
            isPlaying: true,
            isPaused: false,
            currentTime: 0,
            duration: data.totalDuration,
          }));
        } catch (playError) {
          console.error("Audio playback error:", playError);
          setDisplayText(text);
        }
      }
    } catch (error) {
      console.error("Error in text-to-speech:", error);
      setDisplayText(text);
    }
  }, []);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      setIsSpeaking(true);
      setIsAudioPaused(false);
      startTimeRef.current = performance.now() - audio.currentTime * 1000;
      animationFrameRef.current = requestAnimationFrame(() =>
        updateDisplayText(performance.now())
      );
    };

    const handlePause = () => {
      if (!audio.ended) {
        setIsAudioPaused(true);
        audioPositionRef.current = audio.currentTime;
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      }
    };

    const handleEnded = () => {
      setIsSpeaking(false);
      setIsAudioPaused(false);
      audioPositionRef.current = 0;
      setDisplayText(currentSpeakingText);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setPlaybackState((prev) => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        currentTime: 0,
      }));
    };

    const handleTimeUpdate = () => {
      setPlaybackState((prev) => ({
        ...prev,
        currentTime: audio.currentTime,
      }));
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [currentSpeakingText, updateDisplayText]);

  // Message scroll handling
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current || isTyping) {
      if (messagesContainerRef.current && messagesEndRef.current) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages, isTyping]);

  // Auto-play handling for new messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage &&
      lastMessage.role === "assistant" &&
      isTTSEnabled &&
      !isTyping
    ) {
      handleTextToSpeech(lastMessage.content);
    }
  }, [messages, isTTSEnabled, handleTextToSpeech, isTyping]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      const currentAudioRef = audioRef.current;
      if (currentAudioRef) {
        currentAudioRef.pause();
        if (currentAudioRef.src) {
          URL.revokeObjectURL(currentAudioRef.src);
        }
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setIsAudioPaused(false);
      audioPositionRef.current = 0;
      setAudioMetadata(null);
    };
  }, []);

  // Speech toggle handler
  const toggleSpeech = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !isTTSEnabled) return;

    if (isSpeaking) {
      audio.pause();
    } else if (isAudioPaused && currentSpeakingText) {
      audio.currentTime = audioPositionRef.current;
      audio.play().catch(console.error);
    } else if (currentSpeakingText) {
      handleTextToSpeech(currentSpeakingText);
    }
  }, [
    isSpeaking,
    isAudioPaused,
    currentSpeakingText,
    isTTSEnabled,
    handleTextToSpeech,
  ]);

  // TTS toggle handler
  const handleTTSToggle = useCallback(() => {
    if (isTTSEnabled && isSpeaking) {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      setIsSpeaking(false);
      setIsAudioPaused(false);
      audioPositionRef.current = 0;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setDisplayText(currentSpeakingText);
    }
    setIsTTSEnabled(!isTTSEnabled);
  }, [isTTSEnabled, isSpeaking, currentSpeakingText]);

  // Message handling
  const handleSendMessage = async (directMessage?: string) => {
    const messageToSend = directMessage || inputMessage.trim();
    if (!messageToSend) return;

    if (!directMessage) {
      onInputChange("");
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": userEmail,
        },
        body: JSON.stringify({
          content: messageToSend,
          session_id: policyData?.session_id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      let assistantMessage = "";

      if (reader) {
        parentOnSendMessage(messageToSend);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = new TextDecoder().decode(value);
          assistantMessage += text;
          parentOnSendMessage(undefined, assistantMessage);
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      parentOnSendMessage(
        messageToSend,
        "Sorry, I couldn't process your request."
      );
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleVoiceTranscript = (text: string) => {
    onInputChange(text);
    if (text.trim()) {
      setTimeout(() => {
        handleSendMessage(text);
        onInputChange("");
      }, 300);
    }
  };

  // Text formatting
  const formatContent = (text: string) => {
    return text
      .replace(/^-(?=\S)/gm, "- ")
      .replace(/\n-/g, "\n\n-")
      .replace(/\*\*(\S+)\*\*/g, "**$1**")
      .replace(/\n\n+/g, "\n\n")
      .trim();
  };

  // Chat message component
  const SyncedChatMessage = ({
    role,
    content,
    isCurrentlyPlaying,
  }: ChatMessageProps) => {
    const isUser = role === "user";
    const shouldSync =
      !isUser &&
      isCurrentlyPlaying &&
      content === currentSpeakingText &&
      isTTSEnabled;
    const [stableDisplayText, setStableDisplayText] = useState(content);
    const previousTextRef = useRef(content);

    useEffect(() => {
      if (!shouldSync) {
        setStableDisplayText(content);
        return;
      }

      const currentLength = stableDisplayText.length;
      const prevLength = previousTextRef.current.length;

      if (
        currentLength > prevLength ||
        Math.abs(currentLength - prevLength) > 10
      ) {
        setStableDisplayText(displayText || content);
        previousTextRef.current = displayText || content;
      }
    }, [shouldSync, content, stableDisplayText, displayText]);

    return (
      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
        <div
          className={`
            max-w-[85%] rounded-2xl px-4 py-2.5
            ${
              isUser
                ? "bg-[rgb(82,102,255)] text-white"
                : "bg-gray-100 text-gray-800"
            }
          `}
        >
          <div className="text-sm leading-relaxed">
            <ReactMarkdown
              components={{
                pre: ({ children }) => (
                  <div className="whitespace-pre-wrap">{children}</div>
                ),
                code: ({ children }) => (
                  <code className="px-1 py-0.5 rounded-md bg-gray-200">
                    {children}
                  </code>
                ),
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
                transition-all duration-200
              `}
            >
              {shouldSync ? stableDisplayText || "..." : formatContent(content)}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    );
  };

  // Typing indicator component
  const TypingIndicator = () => {
    return (
      <div className="flex items-center gap-1 text-gray-400 h-8 px-3">
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-150" />
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-300" />
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[800px] bg-white rounded-xl shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[rgba(82,102,255,0.15)] to-[rgba(82,102,255,0.05)] rounded-t-xl border-b border-[rgba(82,102,255,0.1)]">
        <div className="flex items-center space-x-3">
          <MessageCircle className="w-6 h-6 text-[rgb(82,102,255)]" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{chatTitle}</h2>
            <p className="text-sm text-gray-600">{chatSubtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowRealtimeChat(!showRealtimeChat)}
            className="ml-2"
          >
            {showRealtimeChat ? "Close Realtime Chat" : "Open Realtime Chat"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTTSToggle}
            className={`
              bg-white border-[rgb(82,102,255)] 
              hover:bg-[rgba(82,102,255,0.1)] transition-colors duration-200
              ${isTTSEnabled ? "text-[rgb(82,102,255)]" : "text-gray-500"}
            `}
          >
            {isTTSEnabled ? "TTS On" : "TTS Off"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSpeech}
            disabled={!currentSpeakingText || !isTTSEnabled}
            className={`
              bg-white border-[rgb(82,102,255)]
              hover:bg-[rgba(82,102,255,0.1)] transition-colors duration-200
              ${
                !currentSpeakingText || !isTTSEnabled
                  ? "opacity-50 cursor-not-allowed"
                  : "text-[rgb(82,102,255)]"
              }
            `}
          >
            {isSpeaking ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
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
      </div>

      {/* Realtime Voice Chat Panel */}
      {showRealtimeChat && (
        <div className="px-6 py-4 border-b border-gray-200">
          <RealtimeVoiceChat policyData={policyData ?? null} />
        </div>
      )}

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-[500px] transition-all duration-300"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className="transition-all duration-300 transform"
            style={{
              opacity: isTyping && index === messages.length - 1 ? 0.7 : 1,
            }}
          >
            <SyncedChatMessage
              role={message.role}
              content={message.content}
              isCurrentlyPlaying={
                message.role === "assistant" &&
                message.content === currentSpeakingText &&
                isSpeaking
              }
            />
          </div>
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
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
            className="flex-1 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[rgb(82,102,255)] focus:border-transparent bg-white transition-all duration-200"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <VoiceButton
            onTranscript={handleVoiceTranscript}
            disabled={isTyping}
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={isTyping}
            className="rounded-full bg-[rgb(82,102,255)] hover:bg-[rgb(82,102,255)]/90 text-white px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={() => setIsSpeaking(false)}
        onError={(e) => {
          console.error("Audio error:", e);
          setIsSpeaking(false);
          setDisplayText(currentSpeakingText);
        }}
      />
    </div>
  );
};

export type { ChatInterfaceProps };
export { ChatInterface };

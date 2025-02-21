"use client"

import { Send, RefreshCw, MessageCircle, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import { useEffect, useRef, useState } from "react"
import VoiceButton from "./VoiceButton"

interface PolicyData {
  session_id: string
}

interface ChatInterfaceProps {
  messages: Array<{ role: "user" | "assistant"; content: string }>
  inputMessage: string
  isTyping: boolean
  onInputChange: (value: string) => void
  onSendMessage: (userMessage?: string, assistantMessage?: string) => void
  onStartNewChat: () => void
  quickPrompts: string[]
  chatTitle: string
  chatSubtext?: string
  policyData?: PolicyData
  userEmail?: string
}

export function ChatInterface({
  messages,
  inputMessage,
  isTyping,
  onInputChange,
  onSendMessage: parentOnSendMessage,
  onStartNewChat,
  quickPrompts,
  chatTitle,
  chatSubtext,
  policyData = { session_id: "default" },
  userEmail = "default@user.com",
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const prevMessagesLengthRef = useRef(messages.length)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isTTSEnabled, setIsTTSEnabled] = useState(true) // TTS enabled by default
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentSpeakingText, setCurrentSpeakingText] = useState("")

  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current || isTyping) {
      if (messagesContainerRef.current && messagesEndRef.current) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: "smooth",
        })
      }
    }
    prevMessagesLengthRef.current = messages.length
  }, [messages, isTyping])

  useEffect(() => {
    // Automatically speak the last assistant message when it's added
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.role === "assistant" && isTTSEnabled) {
      handleTextToSpeech(lastMessage.content)
    }
  }, [messages, isTTSEnabled])

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt)
  }

  const handleSendMessage = async (directMessage?: string) => {
    const messageToSend = directMessage || inputMessage.trim()
    if (!messageToSend) return

    if (!directMessage) {
      onInputChange("")
    }

    try {
      console.log("Message send starting, TTS enabled:", isTTSEnabled)

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": userEmail,
        },
        body: JSON.stringify({
          content: messageToSend,
          session_id: policyData.session_id,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const reader = response.body?.getReader()
      let assistantMessage = ""

      if (reader) {
        parentOnSendMessage(messageToSend)
        console.log("Stream starting, TTS status:", { isTTSEnabled })

        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            console.log("Stream complete, last message length:", assistantMessage.length)
            break
          }

          // Decode the stream chunk and append to message
          const text = new TextDecoder().decode(value)
          assistantMessage += text

          // Update the message in the parent component
          parentOnSendMessage(undefined, assistantMessage)
        }
      }
    } catch (error) {
      console.error("Chat error:", error)
      parentOnSendMessage(messageToSend, "Sorry, I couldn't process your request.")
    }
  }

  const handleTextToSpeech = async (text: string) => {
    try {
      setCurrentSpeakingText(text)
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.play()
        setIsSpeaking(true)
      }
    } catch (error) {
      console.error("Error in text-to-speech:", error)
    }
  }

  const toggleSpeech = () => {
    if (isSpeaking && audioRef.current) {
      audioRef.current.pause()
      setIsSpeaking(false)
    } else if (currentSpeakingText) {
      handleTextToSpeech(currentSpeakingText)
    }
  }

  const handleVoiceTranscript = (text: string) => {
    onInputChange(text)

    setTimeout(() => {
      if (text.trim()) {
        handleSendMessage(text)
        setTimeout(() => {
          onInputChange("")
        }, 300)
      }
    }, 2000)
  }

  return (
    <div className="flex flex-col h-[800px] bg-white rounded-xl shadow-md">
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
            size="sm"
            onClick={() => setIsTTSEnabled(!isTTSEnabled)}
            className="bg-white text-[rgb(82,102,255)] border-[rgb(82,102,255)] hover:bg-[rgba(82,102,255,0.1)] transition-colors duration-200"
          >
            {isTTSEnabled ? "TTS On" : "TTS Off"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSpeech}
            className="bg-white text-[rgb(82,102,255)] border-[rgb(82,102,255)] hover:bg-[rgba(82,102,255,0.1)] transition-colors duration-200"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
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
            <ChatMessage role={message.role} content={message.content} />
          </div>
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
            className="flex-1 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[rgb(82,102,255)] focus:border-transparent bg-white transition-all duration-200"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <VoiceButton onTranscript={handleVoiceTranscript} disabled={isTyping} />
          <Button
            onClick={() => handleSendMessage()}
            className="rounded-full bg-[rgb(82,102,255)] hover:bg-[rgb(82,102,255)]/90 text-white px-4"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <audio ref={audioRef} onEnded={() => setIsSpeaking(false)} />
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 text-gray-400 h-8 px-3">
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-150" />
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-300" />
    </div>
  )
}

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
}

function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user"

  const formatContent = (text: string) => {
    return text
      .replace(/^-(?=\S)/gm, "- ")
      .replace(/\n-/g, "\n\n-")
      .replace(/\*\*(\S+)\*\*/g, "**$1**")
      .replace(/\n\n+/g, "\n\n")
      .trim()
  }

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
  )
}

export { ChatMessage }


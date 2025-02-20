"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { X, RefreshCw, Send, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"

// Add message limit constant
const USER_MESSAGE_LIMIT = 500

interface ChatInterfaceProps {
  onClose?: () => void
  chatTitle: string
  chatSubtext: string
  messages?: Array<{ role: "user" | "assistant"; content: string }>
  inputMessage?: string
  isTyping?: boolean
  onInputChange?: (value: string) => void
  onSendMessage?: (directMessage?: string) => void
  onStartNewChat?: () => void
  quickPrompts?: string[]
}

const CHATBOT_URL = process.env.NEXT_PUBLIC_CHATBOT_URL || "https://default-chatbot-url.com"

export function ChatInterface({
  onClose,
  chatTitle,
  chatSubtext,
  messages = [],
  inputMessage = "",
  isTyping = false,
  onInputChange = () => {},
  onSendMessage = () => {},
  onStartNewChat = () => {},
  quickPrompts = [],
}: ChatInterfaceProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [iframeKey, setIframeKey] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const prevMessagesLengthRef = useRef(messages.length)

  useEffect(() => {
    setIframeLoaded(false)
    return () => {
      const iframe = document.querySelector("iframe")
      if (iframe?.contentWindow) {
        iframe.src = "about:blank"
      }
    }
  }, [])

  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current || isTyping) {
      if (messagesContainerRef.current && messagesEndRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
      }
    }
    prevMessagesLengthRef.current = messages.length
  }, [messages, isTyping])

  const handleIframeError = () => {
    setLoadError("Failed to load chat interface. Please try again later.")
    setIframeLoaded(true)
  }

  const handleRetry = () => {
    setLoadError(null)
    setIframeLoaded(false)
    setIframeKey((prev) => prev + 1)
  }

  // Updated handleQuickPrompt with length check
  const handleQuickPrompt = (prompt: string) => {
    if (prompt.length <= USER_MESSAGE_LIMIT) {
      onSendMessage(prompt)
    }
  }

  // Updated handleInputChange with length limit
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const truncatedValue = e.target.value.slice(0, USER_MESSAGE_LIMIT)
    onInputChange(truncatedValue)
  }

  // Updated handleSendMessage with length check
  const handleSendMessageInternal = () => {
    if (inputMessage.trim() && inputMessage.length <= USER_MESSAGE_LIMIT) {
      onSendMessage()
    }
  }

  if (messages.length > 0) {
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
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[rgb(82,102,255)] focus:border-transparent bg-white"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessageInternal()}
            />
            <Button
              onClick={handleSendMessageInternal}
              className="rounded-full bg-[rgb(82,102,255)] hover:bg-[rgb(82,102,255)]/90 text-white px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 transition-all duration-300 ease-in-out bg-black/50 backdrop-blur-sm z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-title"
    >
      <div
        className="
          fixed transition-all duration-300 ease-in-out shadow-2xl
          inset-0 sm:inset-2 sm:rounded-xl
          bg-gradient-to-b from-white to-gray-50
          flex flex-col
        "
      >
        {/* Header */}
        <div
          className="
            flex justify-between items-center px-2 py-1 border-b 
            bg-white/80 backdrop-blur-md sm:rounded-t-xl min-h-[40px]
          "
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#4B6FEE] flex items-center justify-center">
              <span className="text-white text-xs font-semibold">AI</span>
            </div>
            <div>
              <h2
                id="chat-title"
                className="text-sm font-semibold bg-gradient-to-r from-[#4B6FEE] to-[#3B4FDE] bg-clip-text text-transparent"
              >
                {chatTitle}
              </h2>
              <p className="text-xs text-gray-600">{chatSubtext}</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-gray-100/80 transition-colors"
              aria-label="Close chat interface"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Main chat area with padding bottom for disclosure */}
        <div className="relative flex-grow h-[400px]">
          {!iframeLoaded && !loadError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full h-8 w-8 bg-[#4B6FEE]/20" />
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#4B6FEE] border-t-transparent" />
              </div>
              <p className="mt-3 text-sm text-gray-600 font-medium">Loading...</p>
            </div>
          )}

          {loadError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-white sm:rounded-b-xl">
              <div className="max-w-md text-center space-y-3">
                <p className="text-sm text-red-500 font-medium">{loadError}</p>
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 bg-[#4B6FEE] text-white px-4 py-2 text-sm rounded-full hover:bg-[#3B4FDE] transition-all"
                >
                  <RefreshCw size={14} />
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full sm:rounded-b-xl overflow-hidden">
              <iframe
                key={iframeKey}
                src={CHATBOT_URL}
                className="w-full h-full transition-all duration-500"
                onLoad={() => setIframeLoaded(true)}
                onError={handleIframeError}
                allow="microphone *"
                sandbox="allow-scripts allow-same-origin allow-forms"
                title="Chat Interface"
              />
            </div>
          )}
        </div>

        {/* Compact disclosure footer positioned to just cover powered by text */}
        <div className="absolute bottom-0 left-0 right-0 py-1 px-2 bg-white border-t text-xs text-gray-600 text-center">
          <p className="mb-0.5 text-[10px] leading-tight">
            This AI-powered chatbot provides automated responses and may be inaccurate or incomplete. It does not offer
            financial, legal, or professional advice.
          </p>
          <div className="flex gap-2 text-[#4B6FEE] justify-center text-[10px]">
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Terms of Service
            </a>
          </div>
          {/* Minimal extra padding */}
          <div className="h-1"></div>
        </div>
      </div>
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


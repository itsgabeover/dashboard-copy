// chat-interface.tsx
import { Send, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatMessage } from "./chat-message"
import { useEffect, useRef } from 'react'

interface ChatInterfaceProps {
  messages: Array<{ role: "user" | "assistant"; content: string }>
  inputMessage: string
  isTyping: boolean
  onInputChange: (value: string) => void
  onSendMessage: (directMessage?: string) => void // Modified to accept optional direct message
  onStartNewChat: () => void
  quickPrompts: string[]
  chatTitle: string
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
}: ChatInterfaceProps) {
  // Add ref for message container
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom whenever messages change or isTyping changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // Modified to directly send the prompt without updating input
  const handleQuickPrompt = (prompt: string) => {
    onSendMessage(prompt)
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">{chatTitle}</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onStartNewChat}
          className="flex items-center gap-1.5 text-sm hover:bg-gray-50"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Start New Chat
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} role={message.role} content={message.content} />
        ))}
        {isTyping && <TypingIndicator />}
        {/* Add div for scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
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
            onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
          />
          <Button
            onClick={() => onSendMessage()}
            className="rounded-full bg-[rgb(82,102,255)] hover:bg-[rgb(82,102,255)]/90 text-white px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
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

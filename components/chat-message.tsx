import { Send, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import ReactMarkdown from 'react-markdown'
import { useEffect, useRef } from 'react'

interface ChatInterfaceProps {
  messages: Array<{ role: "user" | "assistant"; content: string }>
  inputMessage: string
  isTyping: boolean
  onInputChange: (value: string) => void
  onSendMessage: (directMessage?: string) => void // Modified to accept optional message
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

  // Modified to directly send the message without updating input
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
            className="flex-1 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
          />
          <Button
            onClick={() => onSendMessage()}
            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-4"
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

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
}

function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user"
  
  // Function to fix common markdown formatting issues
  const formatContent = (text: string) => {
    return text
      // Ensure proper spacing after bullet points
      .replace(/^-(?=\S)/gm, '- ')
      // Add proper line breaks before and after lists
      .replace(/\n-/g, '\n\n-')
      // Fix double asterisks for bold (ensure spaces around words)
      .replace(/\*\*(\S+)\*\*/g, '**$1**')
      // Ensure proper line breaks between paragraphs
      .replace(/\n\n+/g, '\n\n')
      .trim()
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[85%] rounded-2xl px-4 py-2.5
          ${isUser 
            ? "bg-blue-600 text-white" 
            : "bg-gray-100 text-gray-800"}
        `}
      >
        <div className={`text-xs font-medium mb-1 ${isUser ? "text-blue-100" : "text-gray-500"}`}>
          {isUser ? "You" : "Assistant"}
        </div>
        <div className="text-sm leading-relaxed">
          <ReactMarkdown
            className={`
              markdown-content
              ${isUser ? 'text-white' : 'text-gray-800'}
              [&_p]:mb-2
              [&_p:last-child]:mb-0
              [&_ul]:mt-1
              [&_ul]:mb-2
              [&_li]:ml-4
              [&_li]:pl-1
              [&_strong]:font-semibold
              ${isUser 
                ? '[&_strong]:text-white' 
                : '[&_strong]:text-gray-900'}
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

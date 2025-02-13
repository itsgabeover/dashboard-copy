import { Send, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatMessage } from "./chat-message"

interface ChatInterfaceProps {
  messages: Array<{ role: "user" | "assistant"; content: string }>
  inputMessage: string
  isTyping: boolean
  onInputChange: (value: string) => void
  onSendMessage: () => void
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
  const handleQuickPrompt = (prompt: string) => {
    onInputChange(prompt)
    onSendMessage()
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-sm border ring-1 ring-gray-200">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-900">{chatTitle}</h2>
        <Button variant="outline" size="sm" onClick={onStartNewChat} className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Start New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} role={message.role} content={message.content} />
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="animate-bounce">●</div>
            <div className="animate-bounce delay-100">●</div>
            <div className="animate-bounce delay-200">●</div>
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <div className="flex flex-wrap gap-2 mb-4">
          {quickPrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickPrompt(prompt)}
              className="text-sm"
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
            className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-[rgb(82,102,255)]"
            onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
          />
          <Button
            className="rounded-full bg-[rgb(82,102,255)] text-white hover:bg-[rgb(82,102,255)]/90"
            onClick={onSendMessage}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}


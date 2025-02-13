interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`
          max-w-[80%] rounded-2xl px-4 py-2
          ${isUser ? "bg-[rgb(82,102,255)] text-white" : "bg-gray-100 text-gray-800"}
        `}
      >
        <div className="text-sm font-medium mb-1">{isUser ? "You" : "Assistant"}:</div>
        <div className="whitespace-pre-wrap">{content}</div>
      </div>
    </div>
  )
}


import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
}

export function ChatMessage({ role, content }: ChatMessageProps) {
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
        <div className="text-sm leading-relaxed prose-sm">
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

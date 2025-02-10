"use client"

import { useChat } from "ai/react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PolicyChatbotProps {
  sessionId: string
  userEmail: string
}

export function PolicyChatbot({ sessionId, userEmail }: PolicyChatbotProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    headers: {
      "X-User-Email": userEmail,
    },
    body: {
      session_id: sessionId,
    }
  })

  return (
    <Card className="w-full h-[500px] flex flex-col">
      <CardHeader>
        <CardTitle>Chat with AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-4 p-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`rounded-lg p-2 max-w-[80%] ${
                    message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

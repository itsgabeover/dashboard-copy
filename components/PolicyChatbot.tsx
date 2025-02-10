"use client"

import { useState } from "react"
import { useChat } from "ai/react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export function PolicyChatbot({ sessionId, userEmail }: { sessionId: string; userEmail: string }) {
  const [chatStarted, setChatStarted] = useState(false)
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "1",
        role: "system",
        content: `You are a helpful assistant for insurance policy questions. The user's email is ${userEmail} and the session ID is ${sessionId}.`,
      },
    ],
  })

  const startChat = () => {
    setChatStarted(true)
  }

  return (
    <Card className="w-full h-[calc(100vh-2rem)] flex flex-col">
      <CardHeader>
        <CardTitle>Policy Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          {chatStarted ? (
            messages.map((message) => (
              <div key={message.id} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
                <span
                  className={`inline-block p-2 rounded-lg ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
                >
                  {message.content}
                </span>
              </div>
            ))
          ) : (
            <div className="h-full flex items-center justify-center">
              <Button onClick={startChat}>Start Chat</Button>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      {chatStarted && (
        <CardFooter>
          <form onSubmit={handleSubmit} className="flex w-full space-x-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask a question about your policy..."
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              Send
            </Button>
          </form>
        </CardFooter>
      )}
    </Card>
  )
}


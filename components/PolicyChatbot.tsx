"use client"

import { useState, useEffect } from "react"
import { useChat } from "ai/react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Chat, ChatMessage, ParsedPolicyData } from "@/types/chat"
import { supabase } from "@/lib/supabase"

interface PolicyChatbotProps {
  policyData: ParsedPolicyData
  userEmail: string
}

export function PolicyChatbot({ policyData, userEmail }: PolicyChatbotProps) {
  const [chat, setChat] = useState<Chat | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])

  const { messages, input, handleInputChange, handleSubmit, setMessages, isLoading, error } = useChat({
    api: "/api/chat",
    initialMessages: [],
    headers: {
      "X-User-Email": userEmail,
    },
    body: {
      chat_id: chat?.id,
      policy_id: policyData.data.policyOverview.id,
    },
  })

  useEffect(() => {
    const fetchOrCreateChat = async () => {
      const { data: existingChat, error: fetchError } = await supabase
        .from("chats")
        .select("*")
        .eq("user_email", userEmail)
        .eq("policy_id", policyData.data.policyOverview.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (fetchError || !existingChat) {
        const { data: newChat, error: insertError } = await supabase
          .from("chats")
          .insert({ user_email: userEmail, policy_id: policyData.data.policyOverview.id })
          .select()
          .single()

        if (insertError) {
          console.error("Error creating new chat:", insertError)
          return
        }

        setChat(newChat)
      } else {
        setChat(existingChat)
      }
    }

    fetchOrCreateChat()
  }, [userEmail, policyData])

  useEffect(() => {
    if (chat) {
      const fetchMessages = async () => {
        const { data: messages, error } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("chat_id", chat.id)
          .order("created_at", { ascending: true })

        if (error) {
          console.error("Error fetching messages:", error)
          return
        }

        setChatMessages(messages)
        setMessages(
          messages.map((msg) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
          })),
        )
      }

      fetchMessages()
    }
  }, [chat, setMessages])

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!chat) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      chat_id: chat.id,
      role: "user",
      content: input,
      created_at: new Date().toISOString(),
      is_complete: true,
    }

    setChatMessages((prev) => [...prev, userMessage])

    const { error } = await supabase.from("chat_messages").insert(userMessage)

    if (error) {
      console.error("Error saving user message:", error)
    }

    handleSubmit(e)
  }

  return (
    <Card className="w-full h-[500px] flex flex-col">
      <CardHeader>
        <CardTitle>Chat about your {policyData.data.policyOverview.productName} policy</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-4 p-4">
            {chatMessages.map((message) => (
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
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-lg p-2 max-w-[80%] bg-gray-200 text-gray-800">Thinking...</div>
              </div>
            )}
            {error && (
              <div className="flex justify-center">
                <div className="rounded-lg p-2 max-w-[80%] bg-red-500 text-white">Error: {error.message}</div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleFormSubmit} className="flex w-full space-x-2">
          <Input value={input} onChange={handleInputChange} placeholder="Type your message..." className="flex-grow" />
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}


"use client"

import { useState, useEffect } from "react"
import { useChat, type Message } from "ai/react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Chat, ChatMessage, ParsedPolicyData } from "@/types/chat"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface PolicyChatbotProps {
  policyData: ParsedPolicyData
  userEmail: string
}

export function PolicyChatbot({ policyData, userEmail }: PolicyChatbotProps) {
  const [chat, setChat] = useState<Chat | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [initError, setInitError] = useState<string | null>(null)

  const { messages, input, handleInputChange, handleSubmit, setMessages, isLoading, error } = useChat({
    api: "/api/chat",
    initialMessages: [],
    headers: {
      "X-User-Email": userEmail,
    },
    body: {
      chat_id: chat?.id,
      session_id: policyData.sessionId,
    },
  })

  useEffect(() => {
    const fetchOrCreateChat = async () => {
      try {
        setIsInitializing(true)
        setInitError(null)

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          throw new Error("Missing Supabase configuration")
        }

        const { data: existingChat, error: fetchError } = await supabase
          .from("chats")
          .select("*")
          .eq("user_email", userEmail)
          .eq("session_id", policyData.sessionId)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (!fetchError && existingChat) {
          console.log("Found existing chat:", existingChat.id)
          setChat(existingChat)
          return
        }

        console.log("Creating new chat for session:", policyData.sessionId)
        const { data: newChat, error: insertError } = await supabase
          .from("chats")
          .insert({
            user_email: userEmail,
            session_id: policyData.sessionId,
            is_active: true,
          })
          .select()
          .single()

        if (insertError) {
          throw new Error(`Error creating chat: ${insertError.message}`)
        }

        setChat(newChat)
      } catch (err) {
        console.error("Error in fetchOrCreateChat:", err)
        setInitError(err instanceof Error ? err.message : "Failed to initialize chat")
      } finally {
        setIsInitializing(false)
      }
    }

    if (userEmail && policyData.sessionId) {
      fetchOrCreateChat()
    }
  }, [userEmail, policyData.sessionId])

  useEffect(() => {
    if (chat?.id) {
      const fetchMessages = async () => {
        try {
          const { data: fetchedMessages, error } = await supabase
            .from("chat_messages")
            .select("*")
            .eq("chat_id", chat.id)
            .order("created_at", { ascending: true })

          if (error) {
            console.error("Error fetching messages:", error)
            return
          }

          if (fetchedMessages) {
            const formattedMessages: Message[] = fetchedMessages.map((msg) => ({
              id: msg.id,
              role: msg.role as Message["role"],
              content: msg.content,
            }))
            setMessages(formattedMessages)
          }
        } catch (err) {
          console.error("Error in fetchMessages:", err)
        }
      }

      fetchMessages()
    }
  }, [chat?.id, setMessages])

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!chat?.id || !input.trim()) return

    try {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        chat_id: chat.id,
        role: "user",
        content: input.trim(),
        created_at: new Date().toISOString(),
        is_complete: true,
      }

      const { error: saveError } = await supabase.from("chat_messages").insert(userMessage)

      if (saveError) {
        throw new Error(`Failed to save message: ${saveError.message}`)
      }

      await handleSubmit(e)
    } catch (err) {
      console.error("Error in handleFormSubmit:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to send message"
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          role: "system",
          content: `Error: ${errorMessage}`,
        },
      ])
    }
  }

  if (isInitializing) {
    return (
      <Card className="w-full p-4">
        <CardContent>
          <p className="text-gray-500">Initializing chat...</p>
        </CardContent>
      </Card>
    )
  }

  if (initError) {
    return (
      <Card className="w-full p-4">
        <CardContent>
          <p className="text-red-500">Error: {initError}</p>
        </CardContent>
      </Card>
    )
  }

  if (!policyData || !policyData.sessionId) {
    return (
      <Card className="w-full p-4">
        <CardContent>
          <p className="text-red-500">Error: Missing required policy data</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full h-[500px] flex flex-col">
      <CardHeader>
        <CardTitle>Chat about your {policyData.data.policyOverview.productName} policy</CardTitle>
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
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-grow"
            disabled={isLoading || !chat?.id}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim() || !chat?.id}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}


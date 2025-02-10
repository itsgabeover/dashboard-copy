"use client"

import { useState, useEffect } from "react"
import { useChat, type Message } from "ai/react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Chat, ParsedPolicyData } from "@/types/chat"
import { createClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface PolicyChatbotProps {
  sessionId: string
  userEmail: string
}

export function PolicyChatbot({ sessionId, userEmail }: PolicyChatbotProps) {
  const [chat, setChat] = useState<Chat | null>(null)
  const [policyData, setPolicyData] = useState<ParsedPolicyData | null>(null)
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
      session_id: sessionId,
    },
    onError: (error) => {
      console.error("Chat error:", error)
    },
  })

  // Fetch policy data
  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        const { data: policy, error } = await supabase.from("policies").select("*").eq("session_id", sessionId).single()

        if (error) throw error
        setPolicyData(policy.analysis_data)
      } catch (err) {
        console.error("Error fetching policy data:", err)
        setInitError(err instanceof Error ? err.message : "Failed to fetch policy data")
      }
    }

    fetchPolicyData()
  }, [sessionId])

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
          .eq("session_id", sessionId)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (!fetchError && existingChat) {
          console.log("Found existing chat:", existingChat.id)
          setChat(existingChat)
          return
        }

        console.log("Creating new chat for session:", sessionId)
        const { data: newChat, error: insertError } = await supabase
          .from("chats")
          .insert({
            id: uuidv4(),
            user_email: userEmail,
            session_id: sessionId,
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

    if (userEmail && sessionId) {
      fetchOrCreateChat()
    }
  }, [userEmail, sessionId])

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
      await handleSubmit(e, {
        options: {
          body: {
            chat_id: chat.id,
            session_id: sessionId,
            content: input.trim(),
          },
        },
      })
    } catch (err) {
      console.error("Error in handleFormSubmit:", err)
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

  if (!policyData) {
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


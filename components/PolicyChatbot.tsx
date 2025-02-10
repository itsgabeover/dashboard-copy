"use client"

import { useState, useEffect } from "react"
import { useChat, type Message } from "ai/react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"

// Types
interface Chat {
  id: string
  user_email: string
  session_id: string
  is_active: boolean
  created_at?: string
  last_message_at?: string
}

interface PolicyOverview {
  productName: string
  issuer: string
  deathBenefit: number
  annualPremium: number
  productType: string
}

interface ParsedPolicyData {
  data: {
    policyOverview: PolicyOverview
  }
}

interface PolicyChatbotProps {
  sessionId: string
  userEmail: string
}

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export function PolicyChatbot({ sessionId, userEmail }: PolicyChatbotProps) {
  const [chat, setChat] = useState<Chat | null>(null)
  const [policyData, setPolicyData] = useState<ParsedPolicyData | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [initError, setInitError] = useState<string | null>(null)

  const { messages, input, handleInputChange, handleSubmit, setMessages, isLoading, error, reload } = useChat({
    api: "/api/chat",
    initialMessages: [],
    headers: {
      "X-User-Email": userEmail,
    },
    body: {
      chat_id: chat?.id,
      session_id: sessionId,
    },
    onResponse: (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    },
    onFinish: async (message) => {
      if (chat?.id) {
        await fetchMessages(chat.id)
      }
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

  // Initialize or fetch existing chat
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsInitializing(true)
        setInitError(null)

        const { data: existingChat, error: fetchError } = await supabase
          .from("chats")
          .select("*")
          .eq("user_email", userEmail)
          .eq("session_id", sessionId)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (!fetchError && existingChat) {
          setChat(existingChat)
          await fetchMessages(existingChat.id)
          return
        }

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

        if (insertError) throw insertError
        setChat(newChat)
      } catch (err) {
        console.error("Error initializing chat:", err)
        setInitError(err instanceof Error ? err.message : "Failed to initialize chat")
      } finally {
        setIsInitializing(false)
      }
    }

    if (userEmail && sessionId) {
      initializeChat()
    }
  }, [userEmail, sessionId])

  const fetchMessages = async (chatId: string) => {
    try {
      const { data: messages, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true })

      if (error) throw error

      if (messages) {
        const formattedMessages: Message[] = messages.map((msg) => ({
          id: msg.id,
          role: msg.role as Message["role"],
          content: msg.content,
        }))
        setMessages(formattedMessages)
      }
    } catch (err) {
      console.error("Error fetching messages:", err)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!chat?.id || !input.trim()) return

    try {
      await handleSubmit(e)
    } catch (err) {
      console.error("Error submitting message:", err)
    }
  }

  if (isInitializing) {
    return (
      <Card className="w-full p-4">
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-gray-900" />
            <span className="ml-2">Initializing chat...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (initError) {
    return (
      <Card className="w-full p-4">
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <p className="text-red-500">Error: {initError}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!policyData) {
    return (
      <Card className="w-full p-4">
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <p className="text-red-500">Error: Missing required policy data</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Chat about your {policyData?.data?.policyOverview?.productName || "Insurance"} policy</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-lg px-4 py-2 max-w-[80%] bg-muted text-muted-foreground">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="flex justify-center">
                <div className="rounded-lg px-4 py-2 bg-destructive text-destructive-foreground flex items-center gap-2">
                  <span>Error: {error.message}</span>
                  <Button variant="secondary" size="sm" onClick={() => reload()} className="h-7 px-2">
                    Retry
                  </Button>
                </div>
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
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}


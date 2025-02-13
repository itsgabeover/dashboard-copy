import { OpenAIStream, StreamingTextResponse } from "ai"
import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { createChatCompletion } from "@/lib/openai"
import type { Chat, ChatMessage, ParsedPolicyData } from "@/types/chat"
import type { ChatCompletionChunk } from "openai/resources/chat/completions"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

export async function POST(req: NextRequest) {
  try {
    // Parse request
    const body = await req.json()
    const { chat_id, session_id, content } = body
    const userEmail = req.headers.get("X-User-Email")

    // Validate request
    if (!userEmail) {
      return NextResponse.json({ error: "User email required" }, { status: 401 })
    }
    if (!content?.trim()) {
      return NextResponse.json({ error: "Message content required" }, { status: 400 })
    }

    // Get or create chat session
    const chat = await getOrCreateChat(userEmail, chat_id, session_id)
    if (!chat) {
      return NextResponse.json({ error: "Invalid chat session" }, { status: 400 })
    }

    // Fetch policy data
    const { data: policy, error: policyError } = await supabase
      .from("policies")
      .select("*")
      .eq("session_id", session_id)
      .single()

    if (policyError || !policy) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 })
    }

    // Save user message
    const userMessage = await saveMessage(chat.id, "user", content)
    if (!userMessage) {
      return NextResponse.json({ error: "Failed to save message" }, { status: 500 })
    }

    // Get chat history
    const { data: history } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("chat_id", chat.id)
      .order("created_at", { ascending: true })
      .limit(10)

    // Format messages for OpenAI
    const messages = history?.map(msg => ({
      role: msg.role,
      content: msg.content
    })) || []

    // Create OpenAI chat completion
    const response = await createChatCompletion({
      messages: [...messages, { role: "user", content }],
      policyData: policy.analysis_data as ParsedPolicyData,
      stream: true
    })

    // Create stream processor
    const stream = OpenAIStream(response as AsyncIterable<ChatCompletionChunk>, {
      async onCompletion(completion) {
        // Save assistant's complete response
        await saveMessage(chat.id, "assistant", completion)
        await updateChatTimestamp(chat.id)
      }
    })

    // Return streaming response
    return new StreamingTextResponse(stream)

  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ 
      error: "An unexpected error occurred",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

async function getOrCreateChat(
  userEmail: string,
  chat_id?: string,
  session_id?: string
): Promise<Chat | null> {
  try {
    // Try to get existing chat
    if (chat_id) {
      const { data: chat, error } = await supabase
        .from("chats")
        .select("*")
        .eq("id", chat_id)
        .eq("user_email", userEmail)
        .single()

      if (!error && chat) return chat
    }

    // Try to get chat by session
    if (session_id) {
      const { data: chat, error } = await supabase
        .from("chats")
        .select("*")
        .eq("session_id", session_id)
        .eq("user_email", userEmail)
        .single()

      if (!error && chat) return chat

      // Create new chat
      const { data: newChat, error: createError } = await supabase
        .from("chats")
        .insert({
          id: uuidv4(),
          user_email: userEmail,
          session_id: session_id,
          is_active: true,
          last_message_at: new Date().toISOString()
        })
        .select()
        .single()

      if (createError) throw createError
      return newChat
    }

    return null
  } catch (error) {
    console.error("Error in getOrCreateChat:", error)
    throw error
  }
}

async function saveMessage(
  chat_id: string,
  role: ChatMessage["role"],
  content: string
): Promise<ChatMessage | null> {
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        id: uuidv4(),
        chat_id,
        role,
        content,
        is_complete: true
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error saving message:", error)
    return null
  }
}

async function updateChatTimestamp(chat_id: string) {
  try {
    await supabase
      .from("chats")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", chat_id)
  } catch (error) {
    console.error("Error updating chat timestamp:", error)
  }
}

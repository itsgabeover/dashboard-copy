import { experimental_StreamData as StreamData } from "ai"
import { StreamingTextResponse } from "ai"
import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

// Types
type Role = "system" | "user" | "assistant" | "function"

interface Chat {
  id: string
  user_email: string
  session_id: string
  is_active: boolean
}

interface Policy {
  policy_name: string
  status: string
  updated_at: string
  analysis_data: {
    data: {
      policyOverview: {
        issuer: string
        deathBenefit: number
        annualPremium: number
        productType: string
      }
    }
  }
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase environment variables")
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

function convertToChatCompletionMessage(message: { role: string; content: string }): OpenAI.ChatCompletionMessageParam {
  const { role, content } = message
  switch (role) {
    case "system":
    case "user":
    case "assistant":
      return { role, content }
    case "function":
      return { role: "function", content, name: "function" }
    default:
      throw new Error(`Unsupported role: ${role}`)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { chat_id, session_id, content } = body
    const userEmail = req.headers.get("X-User-Email")

    console.log("Received request body:", body)

    if (!userEmail) {
      return NextResponse.json({ error: "User email is required" }, { status: 401 })
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        {
          error: "Message content is required and must be a non-empty string",
          received: content,
        },
        { status: 400 },
      )
    }

    // Get or create chat session
    const chat = await getOrCreateChat(userEmail, chat_id, session_id)
    if (!chat) {
      return NextResponse.json({ error: "Invalid chat or session ID" }, { status: 400 })
    }

    // Fetch associated policy data
    const policyData = await fetchPolicyData(session_id)
    if (!policyData) {
      return NextResponse.json({ error: "Policy data not found" }, { status: 404 })
    }

    // Save user's message first
    try {
      await saveMessageToDatabase(chat.id, "user", content)
    } catch (error) {
      console.error("Error saving user message:", error)
      return NextResponse.json({ error: "Failed to save user message" }, { status: 500 })
    }

    // Prepare messages
    const systemMessage = constructSystemMessage(policyData)
    const data = new StreamData()

    const messagesToSend = [
      { role: "system", content: systemMessage },
      { role: "user", content },
    ]

    // Create OpenAI chat completion
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      messages: messagesToSend.map(convertToChatCompletionMessage),
      stream: true,
    })

    // Create ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        let fullCompletion = ""

        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content
            if (content) {
              fullCompletion += content
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
            }
          }

          if (fullCompletion) {
            await saveMessageToDatabase(chat.id, "assistant", fullCompletion)
            await updateChatTimestamp(chat.id)
          }

          controller.close()
          data.close()
        } catch (error) {
          console.error("Streaming error:", error)
          controller.error(error)
        }
      },
    })

    return new StreamingTextResponse(stream, {}, data)
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

async function getOrCreateChat(userEmail: string, chat_id?: string, session_id?: string): Promise<Chat | null> {
  try {
    if (chat_id) {
      const { data: existingChat, error: chatError } = await supabase
        .from("chats")
        .select("*")
        .eq("id", chat_id)
        .eq("user_email", userEmail)
        .single()

      if (chatError) {
        console.error("Chat fetch error:", chatError)
        throw new Error("Error fetching chat")
      }

      return existingChat
    } else if (session_id) {
      const { data: existingChat, error: fetchError } = await supabase
        .from("chats")
        .select("*")
        .eq("session_id", session_id)
        .eq("user_email", userEmail)
        .single()

      if (!fetchError && existingChat) {
        return existingChat
      }

      const { data: newChat, error: insertError } = await supabase
        .from("chats")
        .insert({
          id: uuidv4(),
          user_email: userEmail,
          session_id: session_id,
          is_active: true,
        })
        .select()
        .single()

      if (insertError) {
        console.error("Chat creation error:", insertError)
        throw new Error("Error creating new chat")
      }

      return newChat
    }
    return null
  } catch (error) {
    console.error("Error in getOrCreateChat:", error)
    throw error
  }
}

async function fetchPolicyData(session_id: string): Promise<Policy | null> {
  const { data: policyData, error: policyError } = await supabase
    .from("policies")
    .select("*")
    .eq("session_id", session_id)
    .single()

  if (policyError) {
    console.error("Error fetching policy data:", policyError)
    return null
  }

  return policyData
}

function constructSystemMessage(policyData: Policy): string {
  const { analysis_data } = policyData
  const { policyOverview } = analysis_data.data

  return `
You are Sage, an expert guide who helps policyholders understand their personalized Insurance Planner AI analysis reports.

Current Policy Details:
- Policy Name: ${policyData.policy_name}
- Issuer: ${policyOverview.issuer}
- Death Benefit: $${policyOverview.deathBenefit.toLocaleString()}
- Annual Premium: $${policyOverview.annualPremium.toLocaleString()}
- Policy Type: ${policyOverview.productType}
- Status: ${policyData.status}
- Last Updated: ${policyData.updated_at}

Instructions:
1. Provide detailed, accurate responses using specific details from this policy
2. If asked about details not provided here, direct users to their policy documents
3. Focus on helping users understand their specific policy features and implications
4. Use the analysis sections to provide context about benefits and potential concerns
5. Never speculate about policy details not explicitly provided in this data
`
}

async function saveMessageToDatabase(chat_id: string, role: Role, content: string) {
  try {
    if (!chat_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
      throw new Error(`Invalid UUID format for chat_id: ${chat_id}`)
    }

    const { data, error: insertError } = await supabase
      .from("chat_messages")
      .insert({
        id: uuidv4(),
        chat_id,
        role,
        content,
        is_complete: true,
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error saving message:", insertError)
      throw insertError
    }

    return data
  } catch (error) {
    console.error("Error in saveMessageToDatabase:", error)
    throw error
  }
}

async function updateChatTimestamp(chat_id: string) {
  try {
    const { error: updateError } = await supabase
      .from("chats")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", chat_id)

    if (updateError) {
      console.error("Error updating chat timestamp:", updateError)
      throw updateError
    }
  } catch (error) {
    console.error("Error in updateChatTimestamp:", error)
    throw error
  }
}

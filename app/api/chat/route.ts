import { StreamingTextResponse, type Message, OpenAIStream, experimental_StreamData } from "ai"
import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import type { Chat, SendMessageParams } from "@/types/chat"
import type { Policy, PolicyQueryResponse } from "@/types/policy"

type Role = "system" | "user" | "assistant"

// Initialize Supabase client with environment variables
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

export async function POST(req: NextRequest) {
  try {
    const { chat_id, session_id, content }: SendMessageParams = await req.json()
    const userEmail = req.headers.get("X-User-Email")

    if (!userEmail) {
      return NextResponse.json({ error: "User email is required" }, { status: 401 })
    }

    const chat = await getOrCreateChat(userEmail, chat_id, session_id)

    if (!chat) {
      return NextResponse.json({ error: "Invalid chat or session ID" }, { status: 400 })
    }

    const policyData = await fetchPolicyData(session_id)

    if (!policyData) {
      return NextResponse.json({ error: "Policy data not found" }, { status: 404 })
    }

    const systemMessage = constructSystemMessage(policyData)

    const data = new experimental_StreamData()

    const messagesToSend: Message[] = [
      { role: "system", content: systemMessage },
      { role: "user", content },
    ]

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      messages: messagesToSend,
      stream: true,
    })

    const stream = OpenAIStream(response, {
      async onCompletion(completion) {
        await saveMessageToDatabase(chat.id, "assistant", completion)
        await updateChatTimestamp(chat.id)
      },
      onFinal() {
        data.close()
      },
    })

    return new StreamingTextResponse(stream, { headers: {} }, data)
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
    } else {
      const { data: newChat, error: insertError } = await supabase
        .from("chats")
        .insert({
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
  }

  return null
}

async function fetchPolicyData(session_id: string): Promise<Policy | null> {
  const { data: policyData, error: policyError }: PolicyQueryResponse = await supabase
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

The user's policy details are as follows:
- **Policy Name:** ${policyData.policy_name}
- **Issuer:** ${policyOverview.issuer}
- **Death Benefit:** $${policyOverview.deathBenefit.toLocaleString()}
- **Annual Premium:** $${policyOverview.annualPremium.toLocaleString()}
- **Policy Type:** ${policyOverview.productType}
- **Policy Status:** ${policyData.status}
- **Last Updated:** ${policyData.updated_at}

Additional Analysis:
${JSON.stringify(analysis_data, null, 2)}

Use this information to provide **detailed, relevant, and accurate** responses. 
- Always **reference specific details from this user's policy**.
- If a user asks about details **not provided here**, direct them to their policy documents.
- Never **speculate** on details not explicitly mentioned in this data.

Your goal is to **help them understand their policy** while staying within the provided information.
`
}

async function saveMessageToDatabase(chat_id: string, role: Role, content: string) {
  const { error: insertError } = await supabase.from("chat_messages").insert({
    chat_id,
    role,
    content,
    is_complete: true,
  })

  if (insertError) {
    console.error("Error saving message:", insertError)
  }
}

async function updateChatTimestamp(chat_id: string) {
  const { error: updateError } = await supabase
    .from("chats")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", chat_id)

  if (updateError) {
    console.error("Error updating chat timestamp:", updateError)
  }
}


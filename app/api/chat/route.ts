import { StreamingTextResponse, type Message, OpenAIStream, experimental_StreamData } from "ai"
import { openai } from "@ai-sdk/openai"
import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import type { Chat } from "@/types/chat"

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

export async function POST(req: NextRequest) {
  try {
    const { messages, chat_id, policy_id } = await req.json()
    const userEmail = req.headers.get("X-User-Email")

    if (!userEmail) {
      return NextResponse.json({ error: "User email is required" }, { status: 401 })
    }

    const chat = await getOrCreateChat(userEmail, chat_id, policy_id)

    if (!chat) {
      return NextResponse.json({ error: "Invalid chat or policy ID" }, { status: 400 })
    }

    const policyData = await fetchPolicyData(policy_id)

    if (!policyData) {
      return NextResponse.json({ error: "Policy data not found" }, { status: 404 })
    }

    const systemMessage = constructSystemMessage(policyData)

    const data = new experimental_StreamData()

    const messagesToSend = [
      { role: "system", content: systemMessage },
      ...messages.map((m: Message) => ({
        role: m.role,
        content: m.content,
      })),
    ]

    const stream = OpenAIStream(
      await openai("gpt-4o").chat.completions.create({
        messages: messagesToSend,
        stream: true,
      }),
      {
        async onCompletion(completion) {
          await saveMessageToDatabase(chat.id, completion)
          await updateChatTimestamp(chat.id)
        },
        onFinal() {
          data.close()
        },
      },
    )

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

async function getOrCreateChat(userEmail: string, chat_id?: string, policy_id?: string): Promise<Chat | null> {
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
  } else if (policy_id) {
    const { data: existingChat, error: fetchError } = await supabase
      .from("chats")
      .select("*")
      .eq("policy_id", policy_id)
      .eq("user_email", userEmail)
      .single()

    if (!fetchError && existingChat) {
      return existingChat
    } else {
      const { data: newChat, error: insertError } = await supabase
        .from("chats")
        .insert({
          user_email: userEmail,
          policy_id: policy_id,
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

async function fetchPolicyData(policy_id: string) {
  const { data: policyData, error: policyError } = await supabase
    .from("policies")
    .select("*")
    .eq("id", policy_id)
    .single()

  if (policyError) {
    console.error("Error fetching policy data:", policyError)
    return null
  }

  return policyData
}

function constructSystemMessage(policyData: any) {
  return `
You are Sage, an expert guide who helps policyholders understand their personalized Insurance Planner AI analysis reports.

The user's policy details are as follows:
- **Policy Name:** ${policyData.policy_name}
- **Issuer:** ${policyData.analysis_data?.data?.policyOverview?.issuer || "Unknown"}
- **Death Benefit:** ${policyData.analysis_data?.data?.policyOverview?.deathBenefit || "N/A"}
- **Annual Premium:** ${policyData.analysis_data?.data?.policyOverview?.annualPremium || "N/A"}
- **Policy Type:** ${policyData.analysis_data?.data?.policyOverview?.productType || "Unknown"}
- **Policy Status:** ${policyData.status}
- **Last Updated:** ${policyData.updated_at}

Additional Analysis:
${JSON.stringify(policyData.analysis_data, null, 2)}

Use this information to provide **detailed, relevant, and accurate** responses. 
- Always **reference specific details from this user's policy**.
- If a user asks about details **not provided here**, direct them to their policy documents.
- Never **speculate** on details not explicitly mentioned in this data.

Your goal is to **help them understand their policy** while staying within the provided information.
`
}

async function saveMessageToDatabase(chat_id: string, content: string) {
  const { error: insertError } = await supabase.from("chat_messages").insert({
    chat_id,
    role: "assistant",
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


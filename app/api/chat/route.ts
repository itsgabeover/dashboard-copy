import { StreamingTextResponse, Message, OpenAIStream, experimental_StreamData } from 'ai'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'
import type { NextRequest } from 'next/server'
import type { Chat } from '@/types/chat'

// Initialize Supabase client with environment variables
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: NextRequest) {
  try {
    const { messages, chat_id, policy_id } = await req.json()
    const userEmail = req.headers.get("X-User-Email")

    if (!userEmail) {
      return new Response("User email is required", { status: 401 })
    }

    let chat: Chat | null = null
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

      chat = existingChat
    } else if (policy_id) {
      const { data: existingChat, error: fetchError } = await supabase
        .from("chats")
        .select("*")
        .eq("policy_id", policy_id)
        .eq("user_email", userEmail)
        .single()

      if (!fetchError && existingChat) {
        chat = existingChat
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

        chat = newChat
      }
    }

    if (!chat) {
      return new Response(JSON.stringify({ error: "Invalid chat or policy ID" }), { status: 400 })
    }

    // ✅ Fetch **all** policy data (not just `analysis_data`)
    const { data: policyData, error: policyError } = await supabase
      .from("policies")
      .select("*") // Fetch entire policy row
      .eq("id", policy_id)
      .single()

    if (policyError || !policyData) {
      console.error("Error fetching policy data:", policyError)
      return new Response(JSON.stringify({ error: "Policy data not found" }), { status: 404 })
    }

    // ✅ Dynamically construct system prompt with **full policy details**
    const systemMessage = `
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

    // Create data stream
    const data = new experimental_StreamData()

    // Convert messages to the format OpenAI expects
    const messagesToSend = [
      { role: 'system', content: systemMessage },
      ...messages.map((m: Message) => ({
        role: m.role,
        content: m.content,
      }))
    ]

    // Create OpenAI completion
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: messagesToSend,
      stream: true,
    }) as unknown as Response

    // Convert the response to a friendly stream
    const stream = OpenAIStream(response, {
      async onCompletion(completion) {
        // Save the message to the database
        const { error: insertError } = await supabase
          .from("chat_messages")
          .insert({
            chat_id: chat?.id,
            role: "assistant",
            content: completion,
            is_complete: true,
          })

        if (insertError) {
          console.error("Error saving message:", insertError)
        }

        // Update chat timestamp
        const { error: updateError } = await supabase
          .from("chats")
          .update({ last_message_at: new Date().toISOString() })
          .eq("id", chat?.id)

        if (updateError) {
          console.error("Error updating chat timestamp:", updateError)
        }
      },
      onFinal() {
        data.close()
      },
    })

    // Return the stream
    return new StreamingTextResponse(stream, { headers: {} }, data)
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500 }
    )
  }
}

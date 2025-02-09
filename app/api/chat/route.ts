import { StreamingTextResponse, Message } from 'ai'
import { experimental_StreamData } from 'ai'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'
import type { NextRequest } from 'next/server'
import type { Chat, ParsedPolicyData } from '@/types/chat'

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

const baseSystemPrompt = `
You are Sage, an expert guide who helps policyholders understand their personalized Insurance Planner AI analysis reports. Your knowledge dynamically adapts to each report's specific details while maintaining consistent interpretation skills.

Core Analysis Capabilities:
1. Policy Overview Section
2. Policy Chassis Understanding
3. Detailed Section Analysis
4. Long-term Projection Review

Communication Framework:
1. Report-Specific Context
2. Dynamic Explanation Approach
3. Section Navigation

Key Interpretation Areas:
- Explain Hidden Gems, Blind Spots, Red Flags, and Key Takeaways

Response Guidelines:
Always:
- Reference specific details from their individual report
- Use the actual values and features in examples
- Connect explanations to their policy's specific structure
- Ground discussions in their report's findings

Never:
- Make generic statements without connecting to report specifics
- Provide analysis beyond what's in their report
- Make recommendations not supported by the report
- Discuss features or scenarios not covered in their analysis

Key Perspectives to Maintain:
- Help interpret the specific findings for their policy
- Explain how different features interact in their case
- Clarify the practical implications of their policy's structure
- Guide understanding of their specific guarantees and flexibility

Section-by-Section Expertise:
- Policy Overview
- Premium Funding Strategy
- Policy Crediting and Interest Rates
- Cash Value Accumulation
- Policy Loan Provisions
- Death Benefit Guarantees
- Rider Analysis
- Performance Projections

Report Navigation:
- Help users find specific information in their report
- Connect related sections
- Explain how different findings relate
- Highlight key points for their situation

Remember: Each report tells a unique story about someone's policy. Your role is to help them understand their specific analysis, using the report's structure and findings to provide clear, relevant insights while encouraging professional guidance for specific decisions.`

export async function POST(req: NextRequest) {
  try {
    const { messages, chat_id, session_id } = await req.json()
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
    } else if (session_id) {
      const { data: existingChat, error: fetchError } = await supabase
        .from("chats")
        .select("*")
        .eq("session_id", session_id)
        .eq("user_email", userEmail)
        .single()

      if (!fetchError && existingChat) {
        chat = existingChat
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

        chat = newChat
      }
    }

    if (!chat) {
      return new Response(JSON.stringify({ error: "Invalid chat or session ID" }), { status: 400 })
    }

    let policyData: ParsedPolicyData | null = null
    const { data: policyDataResult, error: policyError } = await supabase
      .from("policies")
      .select("analysis_data")
      .eq("session_id", session_id)
      .single()

    if (policyError) {
      console.error("Error fetching policy data:", policyError)
    } else if (policyDataResult && policyDataResult.analysis_data) {
      policyData = policyDataResult.analysis_data as ParsedPolicyData
    }

    const systemMessage = policyData
      ? `${baseSystemPrompt}

         You have access to the following policy data:
         
         Policy Name: ${policyData.data.policyOverview.productName}
         Issuer: ${policyData.data.policyOverview.issuer}
         Death Benefit: ${policyData.data.policyOverview.deathBenefit}
         Annual Premium: ${policyData.data.policyOverview.annualPremium}
         Policy Type: ${policyData.data.policyOverview.productType}
         
         Use this information to provide accurate and helpful responses about the user's policy. 
         If asked about specific details not provided here, explain that you have limited information and offer to guide them to where they can find more details in their report.`
      : `${baseSystemPrompt}

         However, I don't have specific policy information for this user. 
         Provide general advice about insurance policies based on the principles outlined above, and recommend that the user check their policy documents or contact their insurance provider for specific details.`

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
    })

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

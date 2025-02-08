import { StreamingTextResponse } from "ai"
import OpenAI from "openai"
import { supabase } from "@/lib/supabase"
import type { NextRequest } from "next/server"
import type { ParsedPolicyData } from "@/types/policy"

export const runtime = "edge"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: NextRequest) {
  const { messages } = await req.json()
  const userEmail = messages[0]?.content?.match(/User email: (.*)/)?.[1]

  let policyData: ParsedPolicyData | null = null
  if (userEmail) {
    try {
      const { data, error } = await supabase
        .from("policies")
        .select("analysis_data")
        .eq("email", userEmail.toLowerCase())
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error) throw error
      if (data) policyData = data.analysis_data as ParsedPolicyData
    } catch (error) {
      console.error("Error fetching policy data:", error)
    }
  }

  const systemMessage = policyData
    ? `You are an AI assistant specializing in insurance policies. 
       You have access to the following policy data:
       
       Policy Name: ${policyData.data.policyOverview.productName}
       Issuer: ${policyData.data.policyOverview.issuer}
       Death Benefit: ${policyData.data.policyOverview.deathBenefit}
       Annual Premium: ${policyData.data.policyOverview.annualPremium}
       Policy Type: ${policyData.data.policyOverview.productType}
       
       Use this information to provide accurate and helpful responses about the user's policy. 
       If asked about specific details not provided here, explain that you have limited information and offer to guide them to where they can find more details.`
    : `You are an AI assistant specializing in insurance policies. 
       However, I don't have specific policy information for this user. 
       Provide general advice about insurance policies and recommend that the user check their policy documents or contact their insurance provider for specific details.`

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
    messages: [{ role: "system", content: systemMessage }, ...messages],
    stream: true,
  })

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content || ""
        controller.enqueue(new TextEncoder().encode(content))
      }
      controller.close()
    },
  })

  return new StreamingTextResponse(stream)
}


/*
import OpenAI from "openai"
import type { ParsedPolicyData } from "@/types/policy"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const getSageSystemPrompt = (policyData: ParsedPolicyData) => {
  return {
    role: "system" as const,
    content: `You are Sage, an expert AI assistant specializing in analyzing insurance policies. You have access to a detailed analysis of the user's policy and will help them understand their coverage.

Current Policy Context:
Product Name: ${policyData.data.policyOverview.productName}
Carrier: ${policyData.data.policyOverview.issuer}
Type: ${policyData.data.policyOverview.productType}
Death Benefit: $${policyData.data.policyOverview.deathBenefit}
Annual Premium: $${policyData.data.policyOverview.annualPremium}`,
  }
}

export interface ChatCompletionOptions {
  messages: Array<{
    role: "system" | "user" | "assistant"
    content: string
  }>
  policyData: ParsedPolicyData
  stream?: boolean
}

export const createChatCompletion = async ({ messages, policyData, stream = false }: ChatCompletionOptions) => {
  const systemPrompt = getSageSystemPrompt(policyData)

  return await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL as string,
    messages: [systemPrompt, ...messages],
    temperature: 0.7,
    stream,
    max_tokens: 1000,
    presence_penalty: 0.6,
    frequency_penalty: 0.3,
  })
}

export async function* createChatCompletionStream({ messages, policyData }: ChatCompletionOptions) {
  const response = await createChatCompletion({
    messages,
    policyData,
    stream: true,
  })

  if (!response) throw new Error("No response from OpenAI")

  // @ts-expect-error - We expect this to be a stream because we set stream: true
  for await (const chunk of response) {
    yield chunk.choices[0]?.delta?.content || ""
  }
}
*/

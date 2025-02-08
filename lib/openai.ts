import OpenAI from 'openai'
import type { ChatCompletionCreateParams } from 'openai/resources/chat'
import type { ParsedPolicyData } from '@/types/policy'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Helper function to format policy data for the system prompt
export const getSageSystemPrompt = (policyData: ParsedPolicyData) => {
  return {
    role: 'system' as const,
    content: `You are Sage, an expert AI assistant specializing in analyzing insurance policies. You have access to a detailed analysis of the user's policy and will help them understand their coverage.

Current Policy Context:
Product Name: ${policyData.data.policyOverview.productName}
Carrier: ${policyData.data.policyOverview.issuer}
Type: ${policyData.data.policyOverview.productType}
Death Benefit: $${policyData.data.policyOverview.deathBenefit}
Annual Premium: $${policyData.data.policyOverview.annualPremium}

Your key responsibilities:
1. Provide accurate information based solely on the policy data provided
2. Explain complex insurance concepts in simple terms
3. Reference specific sections and findings from the policy analysis
4. Highlight relevant Hidden Gems, Blind Spots, and Red Flags when appropriate
5. Maintain context awareness of which policy section is being discussed`
  }
}

export interface ChatCompletionOptions {
  messages: ChatCompletionCreateParams['messages']
  policyData: ParsedPolicyData
  stream?: boolean
}

// Function for regular chat completions
export const createChatCompletion = async ({
  messages,
  policyData,
  stream = false
}: ChatCompletionOptions) => {
  const systemPrompt = getSageSystemPrompt(policyData)

  return await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL as string,
    messages: [systemPrompt, ...messages],
    temperature: 0.7,
    stream,
    max_tokens: 1000,
    presence_penalty: 0.6,
    frequency_penalty: 0.3
  })
}

// Function for streaming chat completions
export async function* createChatCompletionStream({
  messages,
  policyData
}: ChatCompletionOptions) {
  const completion = await createChatCompletion({
    messages,
    policyData,
    stream: true
  })

  if (!completion) throw new Error('No response from OpenAI')

  // Handle streaming response
  for await (const chunk of completion) {
    if (chunk.choices[0]?.delta?.content) {
      yield chunk.choices[0].delta.content
    }
  }
}

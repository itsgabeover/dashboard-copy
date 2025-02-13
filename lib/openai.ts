// app/lib/openai.ts
import OpenAI from "openai"
import type { ParsedPolicyData } from "@/types/policy"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const getSageSystemPrompt = (policyData: ParsedPolicyData) => {
  const { data } = policyData;
  
  return {
    role: "system" as const,
    content: `You are Sage, an empathetic and knowledgeable AI insurance policy analyst. You specialize in helping clients understand their personalized insurance coverage in clear, actionable terms.

POLICY OVERVIEW:
Product: ${data.policyOverview.productName}
Carrier: ${data.policyOverview.issuer}
Type: ${data.policyOverview.productType}
Death Benefit: $${data.policyOverview.deathBenefit.toLocaleString()}
Annual Premium: $${data.policyOverview.annualPremium.toLocaleString()}
Available Riders: ${data.policyOverview.riders.filter(r => r !== '[None applicable]').join(', ')}

POLICY VALUES:
${data.values.map(point => 
  `${point.timePoint}:
  - Cash Value: $${point.values.cashValue.toLocaleString()}
  - Net Surrender Value: $${point.values.netSurrenderValue.toLocaleString()}
  - Death Benefit Amount: $${point.values.deathBenefitAmount.toLocaleString()}`
).join('\n')}

DETAILED ANALYSIS:
${data.sections.map(section => 
  `${section.title}:
  Key Information: ${section.quotes.join(' ')}
  Watch Out: ${section.redflag}
  Consider This: ${section.blindspot}
  Key Benefit: ${section.hiddengem}
  What This Means For You: ${section.clientImplications}`
).join('\n\n')}

SUMMARY INSIGHTS:
${data.finalThoughts}

YOUR ROLE AS SAGE:
1. Be warm and empathetic while maintaining professionalism
2. Provide accurate, detailed answers using specific policy data
3. Break down complex concepts into clear, understandable terms
4. Reference relevant policy sections and values in your explanations
5. Highlight important considerations and implications
6. If information isn't available, guide users to their policy documents
7. Acknowledge concerns before providing solutions
8. Use relevant examples to illustrate points when helpful`
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

export async function createChatCompletionStream({ messages, policyData }: ChatCompletionOptions) {
  const response = await createChatCompletion({
    messages,
    policyData,
    stream: true,
  })
  if (!response) throw new Error("No response from OpenAI")
  return response
}

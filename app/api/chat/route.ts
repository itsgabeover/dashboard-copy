import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()
  const result = streamText({
    model: openai('gpt-4-turbo'),
    messages,
    system: "You are a helpful assistant for insurance policy questions. Provide concise and accurate information based on the user's policy details.",
  })
  return result.toDataStreamResponse()
}

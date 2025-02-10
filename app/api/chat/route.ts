import OpenAI from "openai"
import { OpenAIStream, StreamingTextResponse } from "ai"

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Set runtime config
export const runtime = "edge"

// Define the structure of a chat message
interface ChatMessage {
  content: string
  role: "system" | "user" | "assistant"
}

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages }: { messages: ChatMessage[] } = await req.json()

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    stream: true,
    messages: messages.map((message: ChatMessage) => ({
      content: message.content,
      role: message.role,
    })),
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)

  // Respond with the stream
  return new StreamingTextResponse(stream)
}


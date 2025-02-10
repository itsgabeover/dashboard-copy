import OpenAI from "openai"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { experimental_StreamData } from 'ai'

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
  const { messages }: { messages: ChatMessage[] } = await req.json()

  const data = new experimental_StreamData()
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    stream: true,
    messages: messages.map((message: ChatMessage) => ({
      content: message.content,
      role: message.role,
    })),
  })

  const stream = OpenAIStream(response, {
    onCompletion: (completion) => {
      // Optional: do something with the completion
      data.append({ completion })
    },
    experimental_streamData: true,
  })

  return new StreamingTextResponse(stream, {}, data)
}

import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"
import { type NextRequest, NextResponse } from "next/server"

// Required for streaming responses in Edge functions
export const runtime = 'edge'

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

// Set the maximum duration for the API route
export const maxDuration = 30

// Define the structure of the incoming request body
interface ChatRequest {
  messages: {
    content: string
    role: "system" | "user" | "assistant"
  }[]
  session_id: string
}

export async function POST(req: NextRequest) {
  // Check if the OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
  }

  try {
    // Parse the request body
    const { messages, session_id } = (await req.json()) as ChatRequest
    const userEmail = req.headers.get("X-User-Email")

    // Validate required fields
    if (!userEmail || !session_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid or empty messages array" }, { status: 400 })
    }

    // Create the chat completion
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: messages.map((message) => ({
        content: message.content,
        role: message.role,
      })),
    })

    // Create a stream from the response and return it
    return new StreamingTextResponse(OpenAIStream(response))

  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 })
  }
}

import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: NextRequest) {
  // Check if the OpenAI API key is set
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
  }

  try {
    const { messages } = await req.json()

    // Validate the messages array
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid or empty messages array" }, { status: 400 })
    }

    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      messages: messages.map((message: any) => ({
        content: message.content,
        role: message.role,
      })),
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 })
  }
}


import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import { type NextRequest } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: NextRequest) {
  const { messages, session_id } = await req.json()
  const userEmail = req.headers.get("X-User-Email")

  if (!userEmail || !session_id) {
    return new Response("Missing required fields", { status: 400 })
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: messages.map((message: any) => ({
      content: message.content,
      role: message.role,
    })),
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}

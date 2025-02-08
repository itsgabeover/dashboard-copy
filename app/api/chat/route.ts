import { NextResponse } from "next/server"
import { Configuration, OpenAIApi } from "openai"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { createClient } from "@supabase/supabase-js"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const chat = await supabase
      .from("chats")
      .insert({ messages: JSON.stringify(messages) })
      .select()
      .single()

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: messages,
    })

    const stream = OpenAIStream(response)

    // Process the stream
    const processStream = async () => {
      let fullCompletion = ""
      for await (const chunk of stream) {
        fullCompletion += chunk
      }

      // Save the message to the database
      const { error: insertError } = await supabase.from("chat_messages").insert({
        chat_id: chat?.id,
        role: "assistant",
        content: fullCompletion,
        is_complete: true,
      })

      if (insertError) {
        console.error("Error saving assistant message:", insertError)
      }

      // Update the last_message_at timestamp for the chat
      const { error: updateError } = await supabase
        .from("chats")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", chat?.id)

      if (updateError) {
        console.error("Error updating chat timestamp:", updateError)
      }
    }

    // Start processing the stream
    processStream()

    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error("Error:", error)
    return new NextResponse("Error", { status: 500 })
  }
}


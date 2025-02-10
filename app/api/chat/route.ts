import { OpenAIStream, StreamingTextResponse } from "ai";
import { OpenAI, APIChatCompletion } from "openai";
import { type NextRequest } from "next/server";

// Required for streaming responses in Edge functions
export const runtime = "edge";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Define the structure of the incoming request body
interface ChatRequest {
  messages: {
    content: string;
    role: "system" | "user" | "assistant";
  }[];
  session_id: string;
}

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "OpenAI API key not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { messages, session_id } = (await req.json()) as ChatRequest;
    const userEmail = req.headers.get("X-User-Email");

    if (!userEmail || !session_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid or empty messages array" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch streaming response from OpenAI
    const response: APIChatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages.map((message) => ({
        content: message.content,
        role: message.role,
      })),
      stream: true,
      temperature: 0.7,
      max_tokens: 500,
    });

    // Convert OpenAI response into a text stream
    const stream = OpenAIStream(response);

    // Return the stream response
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while processing your request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

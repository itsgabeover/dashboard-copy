import { OpenAIStream, StreamingTextResponse } from "ai";
import { OpenAI } from "openai";
import { type NextRequest } from "next/server";

// Required for streaming responses in Edge functions
export const runtime = "edge";

// Define types representing the structure of a streaming ChatCompletionChunk
interface ChatCompletionChunk {
  choices: {
    // In streaming responses, a delta is sent that may include content
    delta: {
      content?: string;
    };
  }[];
}

// Define types for the expected Completion shape that OpenAIStream works with
interface CompletionChoice {
  text: string;
}

interface Completion {
  choices: CompletionChoice[];
}

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

/**
 * Helper async generator that transforms an async iterable of
 * ChatCompletionChunk objects into an async iterable of Completion objects.
 */
async function* transformChatCompletionChunks(
  chunks: AsyncIterable<ChatCompletionChunk>
): AsyncIterable<Completion> {
  for await (const chunk of chunks) {
    yield {
      choices: chunk.choices.map((choice) => ({
        // Convert the delta content to a text property (defaulting to an empty string)
        text: choice.delta?.content ?? "",
      })),
    };
  }
}

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "OpenAI API key not configured" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const { messages, session_id } = (await req.json()) as ChatRequest;
    const userEmail = req.headers.get("X-User-Email");

    if (!userEmail || !session_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid or empty messages array" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Fetch streaming response from OpenAI.
    // (The returned type is a stream of ChatCompletionChunk objects.)
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages.map((message) => ({
        content: message.content,
        role: message.role,
      })),
      stream: true,
      temperature: 0.7,
      max_tokens: 500,
    });

    // The OpenAI client returns a stream whose chunks are not in the format
    // that OpenAIStream expects. We first cast the response to an async iterable
    // of ChatCompletionChunk (if needed) and then transform it.
    const responseStream = response as unknown as AsyncIterable<ChatCompletionChunk>;

    // Transform the streaming response to match the expected Completion type.
    const transformedStream = transformChatCompletionChunks(responseStream);

    // Pass the transformed stream to OpenAIStream.
    const stream = OpenAIStream(transformedStream);

    // Return a StreamingTextResponse which can be consumed by the client.
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your request",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// app/api/chat/route.ts
import { OpenAIStream, StreamingTextResponse } from "ai";
import { createClient } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createChatCompletion } from "@/lib/openai";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chat_id, session_id, content } = body;
    const userEmail = req.headers.get("X-User-Email");

    if (!userEmail) {
      return NextResponse.json({ error: "User email is required" }, { status: 401 });
    }

    if (!content?.trim()) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    // Get or create chat session
    const chat = await getOrCreateChat(userEmail, chat_id, session_id);
    if (!chat) {
      return NextResponse.json({ error: "Invalid chat or session ID" }, { status: 400 });
    }

    // Fetch policy data
    const policyData = await fetchPolicyData(session_id);
    if (!policyData) {
      return NextResponse.json({ error: "Policy data not found" }, { status: 404 });
    }

    // Save user message
    await saveMessageToDatabase(chat.id, "user", content);

    // Get OpenAI response
    const response = await createChatCompletion({
      messages: [{ role: "user", content }],
      policyData,
      stream: true,
    });

    // Create stream
    const stream = OpenAIStream(response as any, {
      async onCompletion(completion) {
        await saveMessageToDatabase(chat.id, "assistant", completion);
        await updateChatTimestamp(chat.id);
      },
    });

    return new StreamingTextResponse(stream);

  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

async function getOrCreateChat(userEmail: string, chat_id?: string, session_id?: string) {
  try {
    if (chat_id) {
      const { data: existingChat } = await supabase
        .from("chats")
        .select("*")
        .eq("id", chat_id)
        .eq("user_email", userEmail)
        .single();

      return existingChat;
    }

    if (session_id) {
      const { data: existingChat } = await supabase
        .from("chats")
        .select("*")
        .eq("session_id", session_id)
        .eq("user_email", userEmail)
        .single();

      if (existingChat) return existingChat;

      const { data: newChat } = await supabase
        .from("chats")
        .insert({
          id: uuidv4(),
          user_email: userEmail,
          session_id: session_id,
          is_active: true,
        })
        .select()
        .single();

      return newChat;
    }
    return null;
  } catch (error) {
    console.error("Error in getOrCreateChat:", error);
    throw error;
  }
}

async function fetchPolicyData(session_id: string) {
  const { data: policyData } = await supabase
    .from("policies")
    .select("*")
    .eq("session_id", session_id)
    .single();

  return policyData;
}

async function saveMessageToDatabase(chat_id: string, role: "user" | "assistant", content: string) {
  await supabase
    .from("chat_messages")
    .insert({
      id: uuidv4(),
      chat_id,
      role,
      content,
      is_complete: true,
    });
}

async function updateChatTimestamp(chat_id: string) {
  await supabase
    .from("chats")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", chat_id);
}

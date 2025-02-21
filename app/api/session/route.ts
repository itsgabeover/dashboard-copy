// /app/api/session/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST", // Use POST to get the ephemeral token from OpenAI
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-realtime-preview-2024-12-17",
          voice: "alloy", // adjust voice settings as needed
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `OpenAI API responded with ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
  if (error instanceof Error) {
    console.error("Error generating ephemeral token:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    console.error("Error generating ephemeral token:", error);
    return NextResponse.json({ error: "Failed to generate token" }, { status: 500 });
  }
}
}
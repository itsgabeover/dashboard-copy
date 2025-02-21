// app/api/speech/route.ts
export async function POST(request: Request) {
  // Only allow POST requests (App Router already handles method-based exports)
  const {
    input,
    voice = "alloy",
    model = "tts-1",
    speed = 1,
  } = await request.json();

  const ttsResponse = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input,
      voice,
      speed,
    }),
  });

  if (!ttsResponse.ok) {
    const errorData = await ttsResponse.json();
    return new Response(JSON.stringify({ error: errorData }), {
      status: ttsResponse.status,
    });
  }

  // Get the audio file as a binary stream
  const audioBuffer = await ttsResponse.arrayBuffer();
  return new Response(Buffer.from(audioBuffer), {
    status: 200,
    headers: { "Content-Type": "audio/mpeg" },
  });
}

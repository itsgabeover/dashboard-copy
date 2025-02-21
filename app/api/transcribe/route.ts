// app/api/transcribe/route.ts
import FormData from "form-data";

export async function POST(request: Request) {
  try {
    // Parse the multipart form data from the incoming request.
    const formData = await request.formData();
    const fileField = formData.get("file");
    if (!fileField || typeof fileField === "string") {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // fileField is a Web API File object.
    const file = fileField as File;
    // Convert the file to a Node.js Buffer.
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Create a new instance of FormData (from the npm package)
    // to build the multipart payload for the OpenAI API.
    const nodeFormData = new FormData();
    nodeFormData.append("file", fileBuffer, {
      filename: file.name || "uploadedfile",
      contentType: file.type || "application/octet-stream",
    });
    nodeFormData.append("model", "whisper-1");

    // Prepare headers by merging the form-data headers with authorization.
    // Also add Content-Length for proper request formatting.
    const headers = {
      ...nodeFormData.getHeaders(),
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Length": nodeFormData.getLengthSync().toString(),
    };

    // Get the buffer representation of the form data.
    const bodyBuffer = nodeFormData.getBuffer();

    // Send the request to OpenAI's transcription endpoint.
    const transcriptionResponse = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers,
        body: bodyBuffer,
      }
    );

    const data = await transcriptionResponse.json();
    if (!transcriptionResponse.ok) {
      return new Response(JSON.stringify({ error: data }), {
        status: transcriptionResponse.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error calling transcription API:", error);
    return new Response(JSON.stringify({ error: "Transcription failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

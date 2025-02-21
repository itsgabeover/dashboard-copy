import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Helper function to clean and split text into words
function prepareText(text: string): string[] {
  return text
    .trim()
    .replace(/\s+/g, ' ')  // Normalize whitespace
    .split(/\s+/)          // Split into words
}

// Helper function to estimate word duration
function estimateWordDuration(word: string): number {
  // Average speaking rate is ~150 words per minute
  // Basic duration: 400ms per word
  // Adjust based on word length and punctuation
  let duration = 400;
  
  // Add time for longer words
  if (word.length > 8) {
    duration += 100;
  } else if (word.length > 4) {
    duration += 50;
  }
  
  // Add pause for punctuation
  if (/[,.!?]$/.test(word)) {
    duration += 200;
  }
  
  return duration;
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json()
    
    if (!text) {
      return NextResponse.json(
        { error: "Text is required" }, 
        { status: 400 }
      )
    }

    // Process text into words and calculate timings
    const words = prepareText(text)
    let currentTime = 0
    const wordTimings = words.map(word => {
      const duration = estimateWordDuration(word)
      const timing = {
        word,
        start: currentTime,
        duration
      }
      currentTime += duration
      return timing
    })

    // Generate speech audio
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
      speed: 1.0,  // Maintain consistent speed
    })

    // Convert audio to base64
    const buffer = Buffer.from(await mp3.arrayBuffer())
    const audioBase64 = buffer.toString('base64')

    // Return both audio and timing data
    return new NextResponse(
      JSON.stringify({
        audio: audioBase64,
        timings: wordTimings,
        totalDuration: currentTime,
        wordCount: words.length
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=3600",
        },
      }
    )

  } catch (error) {
    console.error("Text-to-speech error:", error)
    
    // Handle OpenAI specific errors
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json({
        error: "OpenAI API Error",
        message: error.message,
        code: error.code
      }, {
        status: error.status || 500
      })
    }
    
    // Handle general errors
    return NextResponse.json({
      error: "An error occurred during text-to-speech conversion",
      message: error instanceof Error ? error.message : "Unknown error"
    }, {
      status: 500
    })
  }
}

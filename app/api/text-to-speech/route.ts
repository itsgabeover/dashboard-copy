// app/api/text-to-speech/route.ts

import { NextResponse } from "next/server"
import OpenAI from "openai"
import { 
  WordTiming, 
  TTSResponse, 
  TTS_CONSTANTS, 
  TTSError, 
  TTSRequestOptions,
  TTSMetadata 
} from "@/types/tts"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Enhanced text preparation with natural language processing
function prepareText(text: string): string[] {
  // First, split into sentences
  const sentences = text
    .trim()
    .replace(/([.!?])\s*(?=[A-Z])/g, '$1\n') // Better sentence splitting
    .replace(/\n\s*\n/g, '\n') // Remove multiple newlines
    .split('\n')
    .filter(Boolean)

  // Process each sentence
  return sentences.flatMap(sentence => {
    // Enhanced text processing
    const processedSentence = sentence
      .replace(/(\d{4})/g, '$1 ') // Add space after years
      .replace(/(\d{1,3}(,\d{3})+)/g, '$1 ') // Add space after large numbers
      .replace(/([A-Z]{2,})/g, '$1 ') // Add space after acronyms
      .replace(/([.,:;?!])/g, ' $1 ') // Add spaces around punctuation
      .replace(/\s+/g, ' ') // Normalize spaces
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Split camelCase
      .replace(/(\d+)([a-zA-Z])/g, '$1 $2') // Split numbers from text
      .trim()

    // Split into words while preserving meaningful punctuation
    return processedSentence
      .split(/\s+/)
      .filter(word => word.length > 0)
      .map(word => word.trim())
  })
}

function estimateWordDuration(word: string, position: number, totalWords: number): number {
  let duration = TTS_CONSTANTS.BASE_DURATION

  // Enhanced word length adjustment
  const wordLength = word.length
  if (wordLength > TTS_CONSTANTS.LONG_WORD_THRESHOLD) {
    duration += 200
  } else if (wordLength > 4) {
    duration += 100
  }

  // Improved punctuation handling
  if (/[.!?]$/.test(word)) {
    duration += TTS_CONSTANTS.SENTENCE_END_PAUSE
  } else if (/[,;:]$/.test(word)) {
    duration += TTS_CONSTANTS.COMMA_PAUSE
  } else if (/[-—]$/.test(word)) {
    duration += TTS_CONSTANTS.DASH_PAUSE
  } else if (/\.{3}$/.test(word)) {
    duration += TTS_CONSTANTS.ELLIPSIS_PAUSE
  }

  // Enhanced position-based adjustments
  if (position === 0) {
    duration += TTS_CONSTANTS.SENTENCE_START_BUFFER
  } else if (position === totalWords - 1) {
    duration += TTS_CONSTANTS.SENTENCE_END_PAUSE * 1.5
  }

  // Special cases with improved timing
  if (/^[A-Z]{2,}$/.test(word)) {
    duration += 100 // Acronyms
  }
  if (/\d+/.test(word)) {
    duration += 75 // Numbers
  }
  if (word.length === 1) {
    duration = Math.max(duration - 50, TTS_CONSTANTS.MIN_WORD_DURATION)
  }

  // Natural rhythm variations
  duration += Math.sin(position * 0.5) * 30

  return Math.max(duration, TTS_CONSTANTS.MIN_WORD_DURATION)
}

function calculateSpeechRhythm(words: string[]): WordTiming[] {
  let currentTime = 0
  const timings: WordTiming[] = []
  const totalWords = words.length

  words.forEach((word, index) => {
    const duration = estimateWordDuration(word, index, totalWords)
    
    timings.push({
      word,
      start: currentTime,
      duration
    })

    currentTime += duration + TTS_CONSTANTS.WORD_TRANSITION_BUFFER
  })

  return timings
}

function processTextChunks(text: string): string[] {
  return text
    .replace(/([.!?])\s+/g, '$1\n')
    .split('\n')
    .filter(Boolean)
    .map(chunk => chunk.trim())
}

async function generateSpeech(text: string, retryCount = 0): Promise<Buffer> {
  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
      speed: 1.0,
      response_format: "mp3",
    })

    return Buffer.from(await mp3.arrayBuffer())
  } catch (error) {
    if (retryCount < TTS_CONSTANTS.MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, TTS_CONSTANTS.RETRY_DELAY))
      return generateSpeech(text, retryCount + 1)
    }
    throw error
  }
}

export async function POST(req: Request) {
  const startTime = performance.now()
  
  try {
    const { text, voice = 'alloy', speed = 1.0 }: TTSRequestOptions = await req.json()

    if (!text?.trim()) {
      throw new Error("Text is required")
    }

    // Prepare and process text
    const words = prepareText(text)
    const timings = calculateSpeechRhythm(words)

    // Calculate total duration including all pauses and buffers
    const totalDuration = timings.reduce((sum, timing) => 
      Math.max(sum, timing.start + timing.duration + TTS_CONSTANTS.WORD_TRANSITION_BUFFER), 0)

    // Generate speech
    const buffer = await generateSpeech(text)
    const audioBase64 = buffer.toString('base64')

    // Prepare metadata
    const metadata: TTSMetadata = {
      averageWordDuration: totalDuration / words.length,
      sentenceCount: processTextChunks(text).length,
      isAudioPaused: false,
      currentPosition: 0,
      processingTime: performance.now() - startTime,
      wordCount: words.length
    }

    // Prepare response
    const response: TTSResponse = {
      audio: audioBase64,
      timings,
      totalDuration,
      wordCount: words.length,
      metadata
    }

    // Return response with caching headers
    return new NextResponse(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${TTS_CONSTANTS.CACHE_DURATION}`,
      },
    })

  } catch (error) {
    console.error("Text-to-speech error:", error)

    // Enhanced error handling
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json({
        error: "OpenAI API Error",
        message: error.message,
        code: error.code,
        type: error.type,
        params: error.param
      } satisfies TTSError, {
        status: error.status || 500
      })
    }

    // Generic error response
    return NextResponse.json({
      error: "Text-to-speech conversion failed",
      message: error instanceof Error ? error.message : "Unknown error",
      code: "INTERNAL_ERROR",
      timestamp: new Date().toISOString()
    } satisfies TTSError, {
      status: 500
    })
  }
}

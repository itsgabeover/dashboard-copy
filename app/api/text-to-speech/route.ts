// app/api/text-to-speech/route.ts

import { NextResponse } from "next/server"
import OpenAI from "openai"
import { WordTiming, TTSResponse, TTS_CONSTANTS } from "@/types/tts"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Enhanced text preparation with natural language processing
function prepareText(text: string): string[] {
  // First, split into sentences
  const sentences = text
    .trim()
    .replace(/([.!?])\s+/g, '$1\n')
    .split('\n')
    .filter(Boolean);

  // Process each sentence
  return sentences.flatMap(sentence => {
    // Handle special cases for numbers, abbreviations, and symbols
    const processedSentence = sentence
      .replace(/(\d{4})/g, '$1 ') // Add space after years
      .replace(/(\d{1,3}(,\d{3})+)/g, '$1 ') // Add space after large numbers
      .replace(/([A-Z]{2,})/g, '$1 ') // Add space after acronyms
      .replace(/([.,:;?!])/g, ' $1 ') // Add spaces around punctuation
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();

    // Split into words while preserving meaningful punctuation
    return processedSentence
      .split(/\s+/)
      .filter(word => word.length > 0)
      .map(word => word.trim());
  });
}

function estimateWordDuration(word: string, position: number, totalWords: number): number {
  let duration = TTS_CONSTANTS.BASE_DURATION;

  // Word length adjustment
  const wordLength = word.length;
  if (wordLength > 8) {
    duration += 150;
  } else if (wordLength > 4) {
    duration += 75;
  }

  // Punctuation and sentence structure adjustments
  if (/[.!?]$/.test(word)) {
    duration += TTS_CONSTANTS.SENTENCE_END_PAUSE;
  } else if (/[,;:]$/.test(word)) {
    duration += TTS_CONSTANTS.COMMA_PAUSE;
  } else if (/[-—]$/.test(word)) {
    duration += TTS_CONSTANTS.DASH_PAUSE;
  }

  // Position-based adjustments
  if (position === 0) {
    duration += TTS_CONSTANTS.SENTENCE_START_BUFFER;
  }

  // Special cases
  if (/^[A-Z]{2,}$/.test(word)) {
    duration += 50; // Acronyms
  }
  if (/\d+/.test(word)) {
    duration += 50; // Numbers
  }
  if (word.length === 1) {
    duration -= 100; // Single characters (but maintain minimum duration)
  }

  // Add natural rhythm variations
  duration += Math.sin(position * 0.5) * 20;

  // Ensure minimum duration
  return Math.max(duration, TTS_CONSTANTS.MIN_WORD_DURATION);
}

function calculateSpeechRhythm(words: string[]): WordTiming[] {
  let currentTime = 0;
  const timings: WordTiming[] = [];
  const totalWords = words.length;

  words.forEach((word, index) => {
    const duration = estimateWordDuration(word, index, totalWords);
    
    timings.push({
      word,
      start: currentTime,
      duration
    });

    // Add the word duration to the current time
    currentTime += duration;
  });

  return timings;
}

function processTextChunks(text: string): string[] {
  return text
    .replace(/([.!?])\s+/g, '$1\n')
    .split('\n')
    .filter(Boolean)
    .map(chunk => chunk.trim());
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    // Prepare and process text
    const words = prepareText(text);
    const timings = calculateSpeechRhythm(words);

    // Generate speech with OpenAI
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
      speed: 1.0,
      response_format: "mp3",
    });

    // Convert audio to base64
    const buffer = Buffer.from(await mp3.arrayBuffer());
    const audioBase64 = buffer.toString('base64');

    // Calculate total duration for synchronization
    const totalDuration = timings.reduce((sum, timing) => 
      Math.max(sum, timing.start + timing.duration), 0);

    // Prepare response with enhanced metadata
    const response: TTSResponse = {
      audio: audioBase64,
      timings,
      totalDuration,
      wordCount: words.length,
      metadata: {
        averageWordDuration: totalDuration / words.length,
        sentenceCount: processTextChunks(text).length,
      }
    };

    // Return response with caching headers
    return new NextResponse(
      JSON.stringify(response),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=3600",
        },
      }
    );

  } catch (error) {
    console.error("Text-to-speech error:", error);

    // Enhanced error handling
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json({
        error: "OpenAI API Error",
        message: error.message,
        code: error.code,
        type: error.type,
        params: error.param
      }, {
        status: error.status || 500
      });
    }

    // Generic error response
    return NextResponse.json({
      error: "Text-to-speech conversion failed",
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, {
      status: 500
    });
  }
}

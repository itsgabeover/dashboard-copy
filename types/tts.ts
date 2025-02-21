// types/tts.ts

export interface WordTiming {
  word: string
  start: number
  duration: number
}

export interface TTSResponse {
  audio: string
  timings: WordTiming[]
  totalDuration: number
  wordCount: number
  metadata: {
    averageWordDuration: number
    sentenceCount: number
  }
}

// Shared timing constants
export const TTS_CONSTANTS = {
  WORD_TRANSITION_BUFFER: 50,
  BASE_DURATION: 350,
  SENTENCE_END_PAUSE: 450,
  COMMA_PAUSE: 250,
  DASH_PAUSE: 200,
  SENTENCE_START_BUFFER: 100,
  MIN_WORD_DURATION: 200
} as const;

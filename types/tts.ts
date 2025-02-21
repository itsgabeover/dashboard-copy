// types/tts.ts

// Interface for individual word timing data
export interface WordTiming {
  word: string
  start: number
  duration: number
}

// Interface for metadata about the speech processing
export interface TTSMetadata {
  averageWordDuration: number
  sentenceCount: number
  isAudioPaused: boolean
  currentPosition: number
  processingTime?: number
  wordCount: number
}

// Interface for the complete TTS response
export interface TTSResponse {
  audio: string
  timings: WordTiming[]
  totalDuration: number
  wordCount: number
  metadata: TTSMetadata
}

// Interface for TTS request options
export interface TTSRequestOptions {
  text: string
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
  speed?: number
}

// Interface for audio playback state
export interface AudioPlaybackState {
  isPlaying: boolean
  isPaused: boolean
  currentTime: number
  duration: number
}

// Shared timing constants for consistent speech rhythm
export const TTS_CONSTANTS = {
  // Base timing settings
  WORD_TRANSITION_BUFFER: 150,   // Buffer time between words
  BASE_DURATION: 400,            // Base duration for average words
  MIN_WORD_DURATION: 250,        // Minimum duration for any word
  
  // Pause durations for different punctuation
  SENTENCE_END_PAUSE: 600,       // Pause at end of sentences
  COMMA_PAUSE: 300,              // Pause at commas
  DASH_PAUSE: 250,               // Pause at dashes
  ELLIPSIS_PAUSE: 400,          // Pause at ellipsis
  
  // Special timing adjustments
  SENTENCE_START_BUFFER: 200,    // Extra time at start of sentences
  AUDIO_PRELOAD_DELAY: 100,     // Delay before starting audio playback
  LONG_WORD_THRESHOLD: 8,       // Character count for long word detection
  
  // Animation and synchronization settings
  ANIMATION_FRAME_RATE: 60,     // Frames per second for text animation
  SYNC_THRESHOLD: 50,           // Milliseconds threshold for sync adjustments
  
  // Audio processing settings
  FADE_IN_DURATION: 50,         // Milliseconds for audio fade in
  FADE_OUT_DURATION: 50,        // Milliseconds for audio fade out
  
  // Cache settings
  CACHE_DURATION: 3600,         // Cache duration in seconds
  
  // Error handling
  MAX_RETRIES: 3,              // Maximum retries for failed TTS requests
  RETRY_DELAY: 1000            // Delay between retries in milliseconds
} as const

// Utility type for TTS error handling
export interface TTSError extends Error {
  code: string
  status?: number
  type?: string
  param?: string
}

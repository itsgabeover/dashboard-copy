"use client"

import { Mic, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  readonly length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  readonly length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  readonly transcript: string
  readonly confidence: number
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  onstart: ((this: ISpeechRecognition, ev: Event) => void) | null
  onend: ((this: ISpeechRecognition, ev: Event) => void) | null
  onerror: ((this: ISpeechRecognition, ev: Event) => void) | null
  onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => void) | null
  onnomatch: ((this: ISpeechRecognition, ev: Event) => void) | null
  onaudiostart: ((this: ISpeechRecognition, ev: Event) => void) | null
  onaudioend: ((this: ISpeechRecognition, ev: Event) => void) | null
  onsoundstart: ((this: ISpeechRecognition, ev: Event) => void) | null
  onsoundend: ((this: ISpeechRecognition, ev: Event) => void) | null
  onspeechstart: ((this: ISpeechRecognition, ev: Event) => void) | null
  onspeechend: ((this: ISpeechRecognition, ev: Event) => void) | null
}

declare global {
  interface Window {
    SpeechRecognition?: {
      new (): ISpeechRecognition
    }
    webkitSpeechRecognition?: {
      new (): ISpeechRecognition
    }
  }
}

interface VoiceButtonProps {
  onTranscript: (text: string) => void
  disabled?: boolean
}

export default function VoiceButton({ onTranscript, disabled }: VoiceButtonProps) {
  const [isListening, setIsListening] = useState(false)
  const [isPulsing, setIsPulsing] = useState(false)
  const [recognition, setRecognition] = useState<ISpeechRecognition | null>(null)
  const [currentTranscript, setCurrentTranscript] = useState("")

  // First useEffect for pulsing animation
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined

    if (isListening) {
      setIsPulsing(true)
    } else {
      timeoutId = setTimeout(() => setIsPulsing(false), 200)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isListening])

  // Second useEffect for speech recognition setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = false
        recognitionInstance.interimResults = true
        recognitionInstance.lang = "en-US"

        recognitionInstance.onstart = () => {
          setIsListening(true)
          setCurrentTranscript("")
        }

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript
          setCurrentTranscript(transcript)
          
          if (event.results[0].isFinal) {
            setTimeout(() => {
              onTranscript(transcript)
              setIsListening(false)
            }, 800)
          }
        }

        recognitionInstance.onerror = () => {
          setIsListening(false)
        }

        recognitionInstance.onend = () => {
          if (currentTranscript && currentTranscript.trim()) {
            setTimeout(() => {
              onTranscript(currentTranscript)
            }, 800)
          }
          setIsListening(false)
        }

        setRecognition(recognitionInstance)
      }
    }

    return () => {
      // Cleanup function
      if (recognition) {
        recognition.onstart = null
        recognition.onend = null
        recognition.onerror = null
        recognition.onresult = null
      }
    }
  }, [onTranscript, currentTranscript])

  const toggleListening = () => {
    if (!recognition) return

    if (isListening) {
      recognition.stop()
    } else {
      try {
        recognition.start()
      } catch (error) {
        console.error("Error starting speech recognition:", error)
      }
    }
  }

  if (!recognition) {
    return null
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleListening}
      disabled={disabled}
      className={`
        rounded-full transition-all duration-300
        ${isListening 
          ? "bg-[rgb(82,102,255)] text-white hover:bg-[rgb(82,102,255)]/90" 
          : "bg-white hover:bg-gray-50"}
        ${isPulsing ? "ring-4 ring-[rgb(82,102,255)]/20" : ""}
        relative
      `}
    >
      {isListening ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </>
      ) : (
        <Mic className="h-4 w-4" />
      )}
      <span className="sr-only">
        {isListening ? "Stop recording" : "Start recording"}
      </span>
    </Button>
  )
}

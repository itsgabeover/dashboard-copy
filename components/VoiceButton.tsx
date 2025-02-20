"use client"

import { Mic, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

// Type definitions for Web Speech API
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
  onresult: (event: SpeechRecognitionEvent) => void
  onerror: (event: Event) => void
  onend: () => void
}

// Extend Window interface
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
  const [recognition, setRecognition] = useState<ISpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = false
        recognitionInstance.interimResults = true
        recognitionInstance.lang = "en-US"

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript
          if (event.results[0].isFinal) {
            onTranscript(transcript)
            setIsListening(false)
            recognitionInstance.stop()
          }
        }

        recognitionInstance.onerror = () => {
          setIsListening(false)
        }

        recognitionInstance.onend = () => {
          setIsListening(false)
        }

        setRecognition(recognitionInstance)
      }
    }
  }, [onTranscript])

  const toggleListening = () => {
    if (!recognition) return

    if (isListening) {
      recognition.stop()
    } else {
      recognition.start()
      setIsListening(true)
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
      className={`rounded-full transition-all duration-200 ${
        isListening 
          ? "bg-[rgb(82,102,255)] text-white hover:bg-[rgb(82,102,255)]/90" 
          : "bg-white hover:bg-gray-50"
      }`}
    >
      {isListening ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
      <span className="sr-only">
        {isListening ? "Stop recording" : "Start recording"}
      </span>
    </Button>
  )
}

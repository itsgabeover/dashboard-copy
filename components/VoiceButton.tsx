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
  onresult: (event: SpeechRecognitionEvent) => void
  onerror: (event: Event) => void
  onend: () => void
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
  const [recognition, setRecognition] = useState<ISpeechRecognition | null>(null)
  const [currentTranscript, setCurrentTranscript] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = false
        recognitionInstance.interimResults = true
        recognitionInstance.lang = "en-US"

        recognitionInstance.onstart = () => {
          console.log("Speech recognition started")
          setCurrentTranscript("")
        }

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript
          console.log("Interim transcript:", transcript)
          setCurrentTranscript(transcript)
          
          if (event.results[0].isFinal) {
            console.log("Final transcript:", transcript)
            onTranscript(transcript)
            setIsListening(false)
            recognitionInstance.stop()
          }
        }

        recognitionInstance.onerror = (event) => {
          console.error("Speech recognition error:", event)
          setIsListening(false)
        }

        recognitionInstance.onend = () => {
          console.log("Speech recognition ended")
          setIsListening(false)
          // If we have a transcript but it wasn't marked as final, send it anyway
          if (currentTranscript && currentTranscript.trim()) {
            onTranscript(currentTranscript)
          }
        }

        setRecognition(recognitionInstance)
      } else {
        console.warn("Speech recognition not supported in this browser")
      }
    }
  }, [onTranscript, currentTranscript])

  const toggleListening = () => {
    if (!recognition) return

    if (isListening) {
      console.log("Stopping speech recognition")
      recognition.stop()
    } else {
      console.log("Starting speech recognition")
      try {
        recognition.start()
        setIsListening(true)
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

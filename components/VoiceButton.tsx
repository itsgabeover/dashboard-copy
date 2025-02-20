"use client"

import { Mic, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState, useCallback } from "react"

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

  // Setup recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = false
        recognitionInstance.interimResults = true
        recognitionInstance.lang = "en-US"
        setRecognition(recognitionInstance)
      }
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop()
        } catch (e) {
          console.error("Error stopping recognition:", e)
        }
      }
    }
  }, []) // Empty dependency array as this should only run once

  // Handle recognition events
  useEffect(() => {
    if (!recognition) return

    const handleStart = () => {
      console.log("Recognition started")
      setIsListening(true)
      setIsPulsing(true)
    }

    const handleEnd = () => {
      console.log("Recognition ended")
      setIsListening(false)
      setIsPulsing(false)
    }

    const handleError = (event: Event) => {
      console.error("Recognition error:", event)
      setIsListening(false)
      setIsPulsing(false)
    }

    const handleResult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript
      console.log("Got transcript:", transcript)
      
      if (event.results[0].isFinal) {
        console.log("Final transcript:", transcript)
        onTranscript(transcript)
        recognition.stop()
      }
    }

    recognition.onstart = handleStart
    recognition.onend = handleEnd
    recognition.onerror = handleError
    recognition.onresult = handleResult

    return () => {
      recognition.onstart = null
      recognition.onend = null
      recognition.onerror = null
      recognition.onresult = null
    }
  }, [recognition, onTranscript]) // Added recognition to dependency array

  const toggleListening = useCallback(() => {
    if (!recognition) return

    if (isListening) {
      console.log("Stopping recognition")
      try {
        recognition.stop()
        setIsListening(false)
        setIsPulsing(false)
      } catch (e) {
        console.error("Error stopping recognition:", e)
        setIsListening(false)
        setIsPulsing(false)
      }
    } else {
      console.log("Starting recognition")
      try {
        recognition.start()
      } catch (e) {
        console.error("Error starting recognition:", e)
        setIsListening(false)
        setIsPulsing(false)
      }
    }
  }, [recognition, isListening])

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

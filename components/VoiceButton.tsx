"use client"

import { Mic, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

// ... (previous interfaces remain the same)

export default function VoiceButton({ onTranscript, disabled }: VoiceButtonProps) {
  const [isListening, setIsListening] = useState(false)
  const [isPulsing, setIsPulsing] = useState(false)
  const [recognition, setRecognition] = useState<ISpeechRecognition | null>(null)
  const [currentTranscript, setCurrentTranscript] = useState("")

  // Add pulsing effect when starting to listen
  useEffect(() => {
    if (isListening) {
      setIsPulsing(true)
    } else {
      // Delay removing the pulse effect
      const timeout = setTimeout(() => setIsPulsing(false), 200)
      return () => clearTimeout(timeout)
    }
  }, [isListening])

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
          
          // Only send final results after a slight delay
          if (event.results[0].isFinal) {
            setTimeout(() => {
              onTranscript(transcript)
              setIsListening(false)
            }, 800) // Give user time to see the transcribed text
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
  }, [onTranscript, currentTranscript])

  const toggleListening = () => {
    if (!recognition) return

    if (isListening) {
      recognition.stop()
    } else {
      recognition.start()
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

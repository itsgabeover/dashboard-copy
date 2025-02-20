"use client"

import { Volume2, VolumeX } from "lucide-react"
import { useEffect, useState, useRef } from "react"

interface TTSControllerProps {
  isEnabled?: boolean
  onToggle?: (enabled: boolean) => void
  className?: string
}

export function TTSController({ isEnabled = false, onToggle, className = "" }: TTSControllerProps) {
  return (
    <button
      onClick={() => onToggle?.(!isEnabled)}
      className={`text-gray-500 hover:text-gray-700 transition-colors ${className}`}
      aria-label={isEnabled ? "Disable voice response" : "Enable voice response"}
    >
      {isEnabled ? (
        <Volume2 className="h-4 w-4" />
      ) : (
        <VolumeX className="h-4 w-4" />
      )}
    </button>
  )
}

export function useTTS() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const voicesLoadedRef = useRef(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis
      
      if (!voicesLoadedRef.current) {
        const loadVoices = () => {
          const voices = synthRef.current?.getVoices() || []
          voicesLoadedRef.current = voices.length > 0
        }
        
        loadVoices()
        synthRef.current?.addEventListener('voiceschanged', loadVoices)
        
        return () => {
          synthRef.current?.removeEventListener('voiceschanged', loadVoices)
        }
      }
    }

    return () => {
      if (synthRef.current && isSpeaking) {
        synthRef.current.cancel()
      }
    }
  }, [isSpeaking])

  const speak = (text: string) => {
    if (!synthRef.current || !isEnabled || !text.trim()) return

    if (isSpeaking) {
      synthRef.current.cancel()
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "en-US"
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0

    const voices = synthRef.current.getVoices()
    const preferredVoice = voices.find(
      voice => voice.name.includes("Female") && voice.lang.includes("en-US")
    )
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => {
      setIsSpeaking(false)
      synthRef.current?.cancel()
    }

    synthRef.current.speak(utterance)
  }

  return {
    isEnabled,
    isSpeaking,
    setEnabled: setIsEnabled,
    speak
  }
}

"use client"

import { Volume2, VolumeX } from "lucide-react"
import { useEffect, useState, useRef } from "react"

interface TTSControllerProps {
  isEnabled?: boolean
  onToggle?: (enabled: boolean) => void
  className?: string
}

export function TTSController({ isEnabled = false, onToggle, className = "" }: TTSControllerProps) {
  const handleToggle = () => {
    try {
      // Test speech directly without API call
      const testSpeech = () => {
        const utterance = new SpeechSynthesisUtterance("Testing speech synthesis");
        console.log("Attempting test speech");
        window.speechSynthesis.speak(utterance);
      };

      onToggle?.(!isEnabled);
      if (!isEnabled) {
        testSpeech();
      }
    } catch (error) {
      console.error("Toggle error:", error);
    }
  };

  return (
    <button
      onClick={handleToggle}
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
      try {
        synthRef.current = window.speechSynthesis;
        console.log("Speech synthesis available:", !!synthRef.current);

        // Test if speech synthesis is working
        const testUtterance = new SpeechSynthesisUtterance("");
        window.speechSynthesis.speak(testUtterance);
        window.speechSynthesis.cancel(); // Immediately cancel the test
        console.log("Speech synthesis test successful");
      } catch (error) {
        console.error("Speech synthesis initialization error:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!synthRef.current) return;

    const loadVoices = () => {
      try {
        const voices = synthRef.current?.getVoices() || [];
        console.log("Voices loaded:", voices.length);
        voicesLoadedRef.current = voices.length > 0;
      } catch (error) {
        console.error("Error loading voices:", error);
      }
    };

    loadVoices();
    synthRef.current.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      synthRef.current?.removeEventListener('voiceschanged', loadVoices);
      if (isSpeaking) {
        try {
          synthRef.current?.cancel();
        } catch (error) {
          console.error("Error canceling speech:", error);
        }
      }
    };
  }, [isSpeaking]);

  const speak = (text: string) => {
    if (!text?.trim()) {
      console.log("Empty text, skipping speech");
      return;
    }

    if (!synthRef.current || !isEnabled) {
      console.log("Speech synthesis not available or disabled", {
        synthAvailable: !!synthRef.current,
        isEnabled
      });
      return;
    }

    try {
      if (isSpeaking) {
        synthRef.current.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = synthRef.current.getVoices();
      console.log("Available voices:", voices.length);

      const preferredVoice = voices.find(
        voice => voice.name.includes("Female") && voice.lang.includes("en-US")
      );

      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log("Using voice:", preferredVoice.name);
      }

      utterance.onstart = () => {
        console.log("Speech started:", text.slice(0, 50) + "...");
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        console.log("Speech ended");
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        console.error("Speech error:", event);
        setIsSpeaking(false);
      };

      synthRef.current.speak(utterance);
    } catch (error) {
      console.error("Error in speak function:", error);
      setIsSpeaking(false);
    }
  };

  return {
    isEnabled,
    isSpeaking,
    setEnabled: setIsEnabled,
    speak
  };
}

export type { TTSControllerProps };

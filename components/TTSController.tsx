// TTS.tsx
"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useState, useRef } from "react";

// Custom hook implementing buffering and queuing for streaming TTS
export function useTTS() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Buffer and queue for streaming text
  const bufferRef = useRef<string>("");
  const queueRef = useRef<string[]>([]);
  const timerRef = useRef<number | null>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
      console.log("Speech synthesis available:", !!synthRef.current);

      // Fire a test utterance (empty utterance) to prime the API.
      const testUtterance = new SpeechSynthesisUtterance(" ");
      window.speechSynthesis.speak(testUtterance);
      window.speechSynthesis.cancel();
    }
  }, []);

  // Load voices
  useEffect(() => {
    if (!synthRef.current) return;

    const loadVoices = () => {
      try {
        const voices = synthRef.current?.getVoices() || [];
        console.log("Voices loaded:", voices.length);
      } catch (error) {
        console.error("Error loading voices:", error);
      }
    };

    loadVoices();
    synthRef.current.addEventListener("voiceschanged", loadVoices);

    return () => {
      synthRef.current?.removeEventListener("voiceschanged", loadVoices);
      if (isSpeaking) {
        try {
          synthRef.current?.cancel();
        } catch (error) {
          console.error("Error canceling speech:", error);
        }
      }
    };
  }, [isSpeaking]);

  // Process the utterance queue if not currently speaking.
  const processQueue = () => {
    if (isSpeaking || queueRef.current.length === 0 || !synthRef.current || !isEnabled) {
      return;
    }

    const textToSpeak = queueRef.current.shift();
    if (!textToSpeak) return;
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "en-US";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Optionally select a preferred voice if available.
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(
      (voice) => voice.name.includes("Female") && voice.lang.includes("en-US")
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
      console.log("Using voice:", preferredVoice.name);
    }

    utterance.onstart = () => {
      console.log("Speech started:", textToSpeak.slice(0, 50) + "...");
    };

    utterance.onend = () => {
      console.log("Speech ended");
      setIsSpeaking(false);
      processQueue(); // Process next segment in the queue.
    };

    utterance.onerror = (event) => {
      console.error("Speech error:", event);
      setIsSpeaking(false);
      processQueue();
    };

    synthRef.current.speak(utterance);
  };

  // Flush the current buffer to the utterance queue
  const flushBuffer = () => {
    if (bufferRef.current.trim()) {
      queueRef.current.push(bufferRef.current.trim());
      bufferRef.current = "";
      processQueue();
    }
  };

  // Main speak function used to accumulate streaming text.
  // This debounces incoming text for a smooth, continuous experience.
  const speak = (text: string) => {
    if (!text?.trim()) {
      console.log("Empty text, skipping speech");
      return;
    }

    // Append new text to the buffer.
    bufferRef.current += text;

    // Clear any existing debounce timer.
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set a new timer to flush the buffer after 500ms of no new input.
    timerRef.current = window.setTimeout(() => {
      flushBuffer();
    }, 500); // Adjust delay as needed for a natural flow.
  };

  return {
    isEnabled,
    isSpeaking,
    setEnabled,
    speak,
  };
}

// TTS Controller component that uses the above hook
export function TTSController({ className = "" }: { className?: string }) {
  // Only destructuring the variables that are used.
  const { isEnabled, setEnabled } = useTTS();

  const toggleTTS = () => {
    try {
      // Test speech immediately to confirm the API is working.
      const testSpeech = () => {
        const utterance = new SpeechSynthesisUtterance("Testing speech synthesis");
        console.log("Attempting test speech");
        window.speechSynthesis.speak(utterance);
      };

      setEnabled((prev) => {
        const newVal = !prev;
        if (!prev) {
          testSpeech();
        }
        return newVal;
      });
    } catch (error) {
      console.error("Toggle error:", error);
    }
  };

  return (
    <button
      onClick={toggleTTS}
      className={`text-gray-500 hover:text-gray-700 transition-colors ${className}`}
      aria-label={isEnabled ? "Disable voice response" : "Enable voice response"}
    >
      {isEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
    </button>
  );
}

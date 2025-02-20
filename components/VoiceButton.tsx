import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

const VoiceButton = ({ onTranscript, disabled }: VoiceButtonProps) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (event.results[0].isFinal) {
            onTranscript(transcript);
            setIsListening(false);
            recognition.stop();
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognition);
      }
    }
  }, [onTranscript]);

  const toggleListening = () => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  if (!recognition) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleListening}
      disabled={disabled}
      className={`rounded-full transition-all duration-200 ${
        isListening 
          ? 'bg-[rgb(82,102,255)] text-white hover:bg-[rgb(82,102,255)]/90' 
          : 'bg-white hover:bg-gray-50'
      }`}
    >
      {isListening ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
      <span className="sr-only">
        {isListening ? 'Stop recording' : 'Start recording'}
      </span>
    </Button>
  );
};

export default VoiceButton;

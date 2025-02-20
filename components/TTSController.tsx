// In your TTSController.tsx, modify the useTTS function:

export function useTTS() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const voicesLoadedRef = useRef(false)

  // Separate useEffect for initialization
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
      console.log("Speech synthesis initialized:", window.speechSynthesis);
    }
  }, []);

  // Separate useEffect for voice loading
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log("Available voices:", voices);
      voicesLoadedRef.current = voices.length > 0;
    };

    loadVoices(); // Initial load
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const speak = (text: string) => {
    console.log("Speak function called with:", {text, isEnabled});
    
    if (!window.speechSynthesis || !isEnabled || !text?.trim()) {
      console.log("Speech conditions not met:", {
        synthExists: !!window.speechSynthesis,
        isEnabled,
        hasText: !!text?.trim()
      });
      return;
    }

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Get voices synchronously
      const voices = window.speechSynthesis.getVoices();
      console.log("Available voices for speech:", voices);

      utterance.onstart = () => {
        console.log("Speech started");
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

      console.log("Attempting to speak:", text.slice(0, 50));
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Error in speak function:", error);
    }
  };

  return {
    isEnabled,
    isSpeaking,
    setEnabled: setIsEnabled,
    speak
  };
}

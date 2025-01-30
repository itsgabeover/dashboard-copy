"use client"

import { useState, useEffect } from "react"
import { X, Maximize2, Minimize2, RefreshCw } from "lucide-react"

// Type definitions
interface ChatInterfaceProps {
  onClose: () => void
}

interface IframeErrorEvent extends Event {
  target: HTMLIFrameElement
}

// Get the chatbot URL from environment variable or use a default value
const CHATBOT_URL = process.env.NEXT_PUBLIC_CHATBOT_URL || "https://default-chatbot-url.com"

export function ChatInterface({ onClose }: ChatInterfaceProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [iframeKey, setIframeKey] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    setIframeLoaded(false)

    return () => {
      const iframe = document.querySelector("iframe")
      if (iframe?.contentWindow) {
        iframe.src = "about:blank"
      }
    }
  }, [])

  const handleIframeError = (e: IframeErrorEvent) => {
    const errorMessage =
      (e.target as HTMLIFrameElement).contentWindow?.document?.body?.textContent ||
      "Failed to load chat interface. Please try again later."

    console.error("Iframe loading error:", {
      error: e,
      url: CHATBOT_URL,
      timestamp: new Date().toISOString(),
    })

    setLoadError(errorMessage)
    setIframeLoaded(true)
  }

  const handleRetry = () => {
    setLoadError(null)
    setIframeLoaded(false)
    setIframeKey((prev) => prev + 1)
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  return (
    <div
      className={`fixed inset-0 transition-all duration-300 ease-in-out
        ${isMinimized ? "bg-transparent pointer-events-none" : "bg-black/50 backdrop-blur-sm"}
        ${isMinimized ? "z-40" : "z-50"}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-title"
    >
      <div
        className={`
          fixed transition-all duration-300 ease-in-out shadow-2xl
          ${
            isMinimized
              ? "bottom-4 right-4 w-64 sm:w-80 h-12 sm:h-14 rounded-full pointer-events-auto"
              : "inset-0 sm:inset-4 sm:rounded-2xl"
          }
          bg-gradient-to-b from-white to-gray-50
        `}
      >
        <div
          className={`
          flex justify-between items-center px-3 sm:px-4 py-2 border-b 
          bg-white/80 backdrop-blur-md
          ${isMinimized ? "rounded-full" : "sm:rounded-t-2xl"}
        `}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#4B6FEE] flex items-center justify-center">
              <span className="text-white text-xs sm:text-sm font-semibold">AI</span>
            </div>
            <h2
              id="chat-title"
              className="text-sm sm:text-lg font-semibold bg-gradient-to-r from-[#4B6FEE] to-[#3B4FDE] bg-clip-text text-transparent"
            >
              Ask Our AI Helper
            </h2>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={toggleMinimize}
              className="text-gray-500 hover:text-[#4B6FEE] p-1 sm:p-1.5 rounded-full hover:bg-gray-100/80 transition-colors"
              aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-500 p-1 sm:p-1.5 rounded-full hover:bg-gray-100/80 transition-colors"
              aria-label="Close chat interface"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div
          className={`
          relative
          ${isMinimized ? "hidden" : "flex-grow h-[calc(100%-3rem)] sm:h-[calc(100%-3.5rem)]"}
        `}
        >
          {!iframeLoaded && !loadError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full h-10 w-10 sm:h-12 sm:w-12 bg-[#4B6FEE]/20" />
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-2 border-[#4B6FEE] border-t-transparent" />
              </div>
              <p className="mt-4 text-sm sm:text-base text-gray-600 font-medium">Loading your AI assistant...</p>
            </div>
          )}

          {loadError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-white sm:rounded-b-2xl">
              <div className="max-w-md text-center space-y-4">
                <p className="text-sm sm:text-base text-red-500 font-medium">{loadError}</p>
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 bg-[#4B6FEE] text-white px-4 sm:px-6 py-2 text-sm sm:text-base rounded-full hover:bg-[#3B4FDE] transition-all hover:shadow-lg"
                >
                  <RefreshCw size={16} />
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full sm:rounded-b-2xl overflow-hidden">
              <iframe
                key={iframeKey}
                src={CHATBOT_URL}
                className={`
                  w-full h-full transition-all duration-500
                  ${iframeLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}
                `}
                onLoad={() => setIframeLoaded(true)}
                onError={handleIframeError}
                allow="microphone *"
                sandbox="allow-scripts allow-same-origin allow-forms"
                title="Chat Interface"
              />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white to-transparent pointer-events-none sm:rounded-b-2xl" />
            </div>
          )}
        </div>

        {/* Disclosure and links */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-white/80 backdrop-blur-sm text-[10px] sm:text-xs text-gray-600 sm:rounded-b-2xl">
          <p className="mb-1 sm:mb-2">
            This AI-powered chatbot provides automated responses and may be inaccurate or incomplete. It does not offer
            financial, legal, or professional advice.
          </p>
          <p>
            For details on data usage, review our{" "}
            <a
              href="https://www.lifeinsuranceplanner-ai.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4B6FEE] hover:underline"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="https://www.lifeinsuranceplanner-ai.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4B6FEE] hover:underline"
            >
              Terms of Service
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}


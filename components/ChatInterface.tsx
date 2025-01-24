"use client"

import { useState, useEffect } from "react"
import { X, Maximize2, Minimize2, RefreshCw } from "lucide-react"

// Type definitions
interface ChatInterfaceProps {
  onClose: () => void
}

interface IframeErrorEvent extends React.SyntheticEvent<HTMLIFrameElement, Event> {
  currentTarget: HTMLIFrameElement
}

// Validate environment variable
const CHATBOT_URL = process.env.NEXT_PUBLIC_CHATBOT_URL

if (!CHATBOT_URL) {
  throw new Error("NEXT_PUBLIC_CHATBOT_URL is not defined")
}

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
      e.currentTarget?.contentWindow?.document?.body?.textContent ||
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
      className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out
        ${isMinimized ? "bg-transparent pointer-events-none" : "bg-black/50 backdrop-blur-sm"}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-title"
    >
      <div
        className={`
          fixed transition-all duration-300 ease-in-out shadow-2xl
          ${
            isMinimized
              ? "bottom-4 right-4 w-80 h-14 rounded-full pointer-events-auto"
              : "inset-0 md:inset-4 md:rounded-2xl"
          }
          bg-gradient-to-b from-white to-gray-50
        `}
      >
        <div
          className={`
          flex justify-between items-center px-4 py-2 border-b 
          bg-white/80 backdrop-blur-md
          ${isMinimized ? "rounded-full" : "md:rounded-t-2xl"}
        `}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#4B6FEE] flex items-center justify-center">
              <span className="text-white font-semibold">AI</span>
            </div>
            <h2
              id="chat-title"
              className="text-lg font-semibold bg-gradient-to-r from-[#4B6FEE] to-[#3B4FDE] bg-clip-text text-transparent"
            >
              Ask Our AI Helper
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMinimize}
              className="text-gray-500 hover:text-[#4B6FEE] p-1.5 rounded-full hover:bg-gray-100/80 transition-colors"
              aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
            >
              {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-500 p-1.5 rounded-full hover:bg-gray-100/80 transition-colors"
              aria-label="Close chat interface"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div
          className={`
          relative
          ${isMinimized ? "hidden" : "flex-grow h-[calc(100%-3.5rem)]"}
        `}
        >
          {!iframeLoaded && !loadError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 bg-[#4B6FEE]/20" />
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#4B6FEE] border-t-transparent" />
              </div>
              <p className="mt-4 text-gray-600 font-medium">Loading your AI assistant...</p>
            </div>
          )}

          {loadError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-white">
              <div className="max-w-md text-center space-y-4">
                <p className="text-red-500 font-medium">{loadError}</p>
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 bg-[#4B6FEE] text-white px-6 py-2 rounded-full hover:bg-[#3B4FDE] transition-all hover:shadow-lg"
                >
                  <RefreshCw size={18} />
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <iframe
              key={iframeKey}
              src={CHATBOT_URL}
              className={`
                w-full h-full transition-all duration-500
                ${iframeLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}
              `}
              frameBorder="0"
              onLoad={() => setIframeLoaded(true)}
              onError={handleIframeError}
              allow="microphone *"
              sandbox="allow-scripts allow-same-origin allow-forms"
              title="Chat Interface"
            />
          )}
        </div>
      </div>
    </div>
  )
}


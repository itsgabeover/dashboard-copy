"use client"

import { useState, useEffect } from "react"
import { X, RefreshCw } from "lucide-react"

interface ChatInterfaceProps {
  onClose: () => void
}

const CHATBOT_URL = process.env.NEXT_PUBLIC_CHATBOT_URL || "https://default-chatbot-url.com"

export function ChatInterface({ onClose }: ChatInterfaceProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [iframeKey, setIframeKey] = useState(0)

  useEffect(() => {
    setIframeLoaded(false)
    return () => {
      const iframe = document.querySelector("iframe")
      if (iframe?.contentWindow) {
        iframe.src = "about:blank"
      }
    }
  }, [])

  const handleIframeError = () => {
    setLoadError("Failed to load chat interface. Please try again later.")
    setIframeLoaded(true)
  }

  const handleRetry = () => {
    setLoadError(null)
    setIframeLoaded(false)
    setIframeKey((prev) => prev + 1)
  }

  return (
    <div
      className="fixed inset-0 transition-all duration-300 ease-in-out bg-black/50 backdrop-blur-sm z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-title"
    >
      <div
        className="
          fixed transition-all duration-300 ease-in-out shadow-2xl
          inset-0 sm:inset-2 sm:rounded-xl
          bg-gradient-to-b from-white to-gray-50
          flex flex-col
        "
      >
        {/* Header */}
                  <div
          className="
            flex justify-between items-center px-2 py-1 border-b 
            bg-white/80 backdrop-blur-md sm:rounded-t-xl min-h-[40px]
          "
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#4B6FEE] flex items-center justify-center">
              <span className="text-white text-xs font-semibold">AI</span>
            </div>
            <h2
              id="chat-title"
              className="text-sm font-semibold bg-gradient-to-r from-[#4B6FEE] to-[#3B4FDE] bg-clip-text text-transparent"
            >
              Ask Our AI Helper
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-gray-100/80 transition-colors"
            aria-label="Close chat interface"
          >
            <X size={14} />
          </button>
        </div>

        {/* Main chat area with padding bottom for disclosure */}
        <div className="relative flex-grow h-[calc(100%-5rem)]">
          {!iframeLoaded && !loadError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full h-8 w-8 bg-[#4B6FEE]/20" />
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#4B6FEE] border-t-transparent" />
              </div>
              <p className="mt-3 text-sm text-gray-600 font-medium">Loading...</p>
            </div>
          )}

          {loadError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-white sm:rounded-b-xl">
              <div className="max-w-md text-center space-y-3">
                <p className="text-sm text-red-500 font-medium">{loadError}</p>
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 bg-[#4B6FEE] text-white px-4 py-2 text-sm rounded-full hover:bg-[#3B4FDE] transition-all"
                >
                  <RefreshCw size={14} />
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full sm:rounded-b-xl overflow-hidden">
              <iframe
                key={iframeKey}
                src={CHATBOT_URL}
                className="w-full h-full transition-all duration-500"
                onLoad={() => setIframeLoaded(true)}
                onError={handleIframeError}
                allow="microphone *"
                sandbox="allow-scripts allow-same-origin allow-forms"
                title="Chat Interface"
              />
            </div>
          )}
        </div>

        {/* Compact disclosure footer positioned to just cover powered by text */}
        <div className="absolute bottom-0 left-0 right-0 py-1 px-2 bg-white border-t text-xs text-gray-600 text-center">
          <p className="mb-0.5 text-[10px] leading-tight">
            This AI-powered chatbot provides automated responses and may be inaccurate or incomplete. It does not offer
            financial, legal, or professional advice.
          </p>
          <div className="flex gap-2 text-[#4B6FEE] justify-center text-[10px]">
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Terms of Service
            </a>
          </div>
          {/* Minimal extra padding */}
          <div className="h-1"></div>
        </div>
      </div>
    </div>
  )
}

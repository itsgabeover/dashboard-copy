'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

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
  throw new Error('NEXT_PUBLIC_CHATBOT_URL is not defined')
}

export function ChatInterface({ onClose }: ChatInterfaceProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [iframeKey, setIframeKey] = useState(0)

  useEffect(() => {
    setIframeLoaded(false) // Reset on mount

    return () => {
      // Cleanup iframe resources
      const iframe = document.querySelector('iframe')
      if (iframe?.contentWindow) {
        iframe.src = 'about:blank'
      }
    }
  }, [])

  const handleIframeError = (e: IframeErrorEvent) => {
    const errorMessage = e.currentTarget?.contentWindow?.document?.body?.textContent 
      || 'Failed to load chat interface. Please try again later.'
    
    console.error('Iframe loading error:', {
      error: e,
      url: CHATBOT_URL,
      timestamp: new Date().toISOString()
    })
    
    setLoadError(errorMessage)
    setIframeLoaded(true)
  }

  const handleRetry = () => {
    setLoadError(null)
    setIframeLoaded(false)
    setIframeKey(prev => prev + 1)
  }

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-50 md:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-title"
    >
      <div className="fixed inset-0 md:relative md:rounded-lg bg-white flex flex-col md:max-w-4xl md:mx-auto md:h-[80vh]">
        <div className="flex justify-between items-center p-2 border-b bg-white h-12">
          <h2 
            id="chat-title" 
            className="text-lg font-semibold text-[#4B6FEE]"
          >
            Ask Our AI Helper
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close chat interface"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-grow relative">
          {!iframeLoaded && !loadError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B6FEE]" />
              <p className="mt-4 text-gray-600">Loading chat interface...</p>
            </div>
          )}
          
          {loadError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <p className="text-red-500 mb-4 text-center">{loadError}</p>
              <button 
                onClick={handleRetry}
                className="bg-[#4B6FEE] text-white px-6 py-2 rounded-md hover:bg-[#3B4FDE] transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <iframe
              key={iframeKey}
              src={CHATBOT_URL}
              width="100%"
              height="100%"
              frameBorder="0"
              className={`w-full h-full transition-opacity duration-300 ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`}
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

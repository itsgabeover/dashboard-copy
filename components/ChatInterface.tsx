'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

type ChatInterfaceProps = {
  onClose: () => void
  isAuthenticated: boolean
}

export function ChatInterface({ onClose, isAuthenticated }: ChatInterfaceProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [iframeKey, setIframeKey] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setIframeLoaded(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleIframeError = (e: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
    console.error('Iframe loading error:', e)
    setLoadError('Failed to load chat interface. Please try again later.')
    setIframeLoaded(true)
  }

  const handleRetry = () => {
    setLoadError(null)
    setIframeLoaded(false)
    setIframeKey(prev => prev + 1)
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="fixed inset-0 bg-white flex flex-col">
        <div className="flex justify-between items-center p-2 border-b bg-white h-12">
          <h2 className="text-lg font-semibold text-[#4B6FEE]">Ask Our AI Helper</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-grow relative">
          {!iframeLoaded && !loadError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B6FEE]"></div>
            </div>
          )}
          {loadError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-red-500 mb-4">{loadError}</p>
              <button 
                onClick={handleRetry}
                className="bg-[#4B6FEE] text-white px-4 py-2 rounded-md"
              >
                Try Again
              </button>
            </div>
          ) : (
            <iframe
              key={iframeKey}
              src={process.env.NEXT_PUBLIC_CHATBOT_URL}
              width="100%"
              height="100%"
              frameBorder="0"
              className={`w-full h-full ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIframeLoaded(true)}
              onError={handleIframeError}
              allow="microphone *"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { ChatInterface } from './ChatInterface'

export function ChatButton() {
  const [showChat, setShowChat] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check for authentication token
    const hasAuthToken = document.cookie.includes('auth-token')
    setIsAuthenticated(hasAuthToken)
  }, [])

  const handleChatClick = () => {
    if (!isAuthenticated) {
      alert('Please log in to chat with our AI Helper')
      return
    }
    setShowChat(true)
  }

  // Completely hide the button if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <button
        onClick={handleChatClick}
        className="fixed bottom-4 right-4 bg-primary-blue text-white rounded-full p-4 shadow-lg hover:bg-secondary-blue transition-colors z-40"
      >
        Ask Our AI Helper
      </button>
      {showChat && <ChatInterface onClose={() => setShowChat(false)} />}
    </>
  )
}

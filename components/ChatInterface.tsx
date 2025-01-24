'use client'

import { useState, useEffect } from 'react'
import { ChatInterface } from './ChatInterface'

export function ChatButton() {
  const [showChat, setShowChat] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const hasAuthToken = document.cookie.includes('auth-token')
      setIsAuthenticated(hasAuthToken)
    }
    
    // Check initially
    checkAuth()
    
    // Check whenever cookies change
    window.addEventListener('storage', checkAuth)
    
    return () => window.removeEventListener('storage', checkAuth)
  }, [])

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-4 right-4 bg-primary-blue text-white rounded-full p-4 shadow-lg hover:bg-secondary-blue transition-colors z-40"
      >
        Ask Our AI Helper
      </button>
      {showChat && <ChatInterface onClose={() => setShowChat(false)} isAuthenticated={isAuthenticated} />}
    </>
  )
}

'use client'
import { useState } from 'react'
import { ChatInterface } from './ChatInterface'

export function ChatButton() {
  const [showChat, setShowChat] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-4 right-4 bg-primary-blue text-white rounded-full p-4 shadow-lg hover:bg-secondary-blue transition-colors z-40"
      >
        Ask Our AI Helper
      </button>
      {showChat && <ChatInterface onClose={() => setShowChat(false)} />}
    </>
  )
} 

import React from 'react'

type MessageType = 'processing' | 'success' | 'error'

interface PaymentMessageProps {
  type: MessageType
  message: string
}

export function PaymentMessage({ type, message }: PaymentMessageProps) {
  return (
    <div className={`message ${type}`}>
      {message}
    </div>
  )
}


// app/payment-success/page.tsx
'use client'
import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function PaymentProcessor() {
  const [isRedirecting, setIsRedirecting] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const processPayment = async () => {
      try {
        const sessionId = searchParams.get('session_id')
        if (!sessionId) {
          throw new Error('No session ID provided')
        }
        
        // Use the new verify-payment endpoint
        const response = await fetch(`/api/verify-payment?session_id=${sessionId}`)
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to verify payment')
        }

        const data = await response.json()
        
        if (data.success && data.token) {
          // Redirect to upload page with token
          router.push(`/upload/${data.token}`)
        } else {
          throw new Error('Payment verification failed')
        }
      } catch (error) {
        console.error('Error processing payment:', error)
        setIsRedirecting(false)
        setError(error instanceof Error ? error.message : 'Unknown error')
      }
    }
    processPayment()
  }, [router, searchParams])

  // Rest of your component stays the same...
}

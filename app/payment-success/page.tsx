'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function PaymentSuccessPage() {
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

        // Wait a moment for webhook processing
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Get upload URL
        const response = await fetch('/api/get-upload-url', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to get upload URL')
        }

        const data = await response.json()
        
        if (!data.upload_url) {
          throw new Error('No upload URL received')
        }

        // Redirect to upload page
        router.push(data.upload_url)
      } catch (error) {
        console.error('Error processing payment:', error)
        setIsRedirecting(false)
        setError(error instanceof Error ? error.message : 'Unknown error')
      }
    }

    processPayment()
  }, [router, searchParams])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">
            Error Processing Payment
          </h1>
          <p className="text-gray-600 mb-4">
            {error}
          </p>
          <p className="text-gray-600 mb-4">
            Please contact support if this issue persists.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#4B6FEE] text-white px-4 py-2 rounded-lg hover:bg-[#3B4FDE]"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B6FEE] mx-auto mb-4"></div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600">
          {isRedirecting ? 'Preparing your upload page...' : 'Processing payment...'}
        </p>
      </div>
    </div>
  )
}


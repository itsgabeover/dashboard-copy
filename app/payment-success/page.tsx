'use client'
import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// Payment processor component
function PaymentProcessor() {
  const [isRedirecting, setIsRedirecting] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    let intervalId: NodeJS.Timeout

    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get('session_id')
        if (!sessionId) {
          throw new Error('No session ID provided')
        }

        const response = await fetch(`/api/verify-payment?session_id=${sessionId}`)
        const data = await response.json()

        if (!data.success) {
          // If still pending, continue polling
          if (data.status === 'pending') {
            return
          }
          throw new Error(data.message || 'Failed to verify payment')
        }

        if (data.token) {
          // Redirect to upload page with token
          router.push(`/upload/${data.token}`)
        } else {
          throw new Error('No valid token received')
        }
      } catch (error) {
        console.error('Error processing payment:', error)
        setIsRedirecting(false)
        setError(error instanceof Error ? error.message : 'Unknown error')
      }
    }

    // Start polling
    intervalId = setInterval(verifyPayment, 2000)
    
    // Stop polling after 30 seconds
    timeoutId = setTimeout(() => {
      clearInterval(intervalId)
      setError('Payment verification timed out')
    }, 30000)

    return () => {
      clearInterval(intervalId)
      clearTimeout(timeoutId)
    }
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

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B6FEE] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentProcessor />
    </Suspense>
  )
}

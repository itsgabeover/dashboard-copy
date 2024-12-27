'use client'
import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { ReactElement } from 'react'

type VerifyResponse = {
  success: boolean
  status?: string
  message?: string
  token?: string
}

function PaymentProcessor(): ReactElement {
  console.log('PaymentProcessor mounted') // Component mount log
  const [error, setError] = useState<string>()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    console.log('PaymentProcessor useEffect started') // Effect start log
    
    const verifyPayment = async (): Promise<void> => {
      try {
        const sessionId = searchParams.get('session_id')
        console.log('Attempting verification with session ID:', sessionId) // Session ID log
        
        if (!sessionId) {
          throw new Error('No session ID provided')
        }

        const response = await fetch(`/api/verify-payment?session_id=${sessionId}`)
        const data = await response.json() as VerifyResponse
        
        console.log('Verify response:', data)
        console.log('Current URL:', window.location.href) // Current URL log
        
        if (data.success && data.token) {
          console.log('Success condition met, redirecting to:', `/upload/${data.token}`) // Pre-redirect log
          router.push(`/upload/${data.token}`)
          console.log('Redirect initiated') // Post-redirect log
          return
        }

        if (data.status === 'pending') {
          console.log('Payment still pending') // Pending state log
          return
        }

        setError(data.message || 'Verification failed')
      } catch (err) {
        console.error('Verification error:', err)
        setError(err instanceof Error ? err.message : 'Failed to verify payment')
      }
    }

    console.log('Setting up interval for payment verification') // Interval setup log
    const intervalId = setInterval(verifyPayment, 2000)
    
    // Run initial verification
    verifyPayment()

    const timeoutId = setTimeout(() => {
      console.log('Verification timed out') // Timeout log
      clearInterval(intervalId)
      setError('Payment verification timed out')
    }, 30000)

    return () => {
      console.log('PaymentProcessor cleanup running') // Cleanup log
      clearInterval(intervalId)
      clearTimeout(timeoutId)
    }
  }, [router, searchParams])

  // Rest of the component remains unchanged...
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">
            Error Processing Payment
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#4B6FEE] text-white px-4 py-2 rounded-lg hover:bg-[#3B4FDE]"
            type="button"
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B6FEE] mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600">Processing your payment...</p>
      </div>
    </div>
  )
}

// Loading component remains unchanged
function LoadingPage(): ReactElement {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B6FEE] mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

// Main page component remains unchanged
export default function PaymentSuccessPage(): ReactElement {
  return (
    <Suspense fallback={<LoadingPage />}>
      <PaymentProcessor />
    </Suspense>
  )
}

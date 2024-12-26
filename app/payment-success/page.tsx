// app/payment-success/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type VerifyResponse = {
  success: boolean
  status?: string
  message?: string
  token?: string
}

export default function PaymentSuccessPage(): JSX.Element {
  const [error, setError] = useState<string>()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const verifyPayment = async (): Promise<void> => {
      try {
        const sessionId = searchParams.get('session_id')
        if (!sessionId) {
          throw new Error('No session ID provided')
        }

        const response = await fetch(`/api/verify-payment?session_id=${sessionId}`)
        const data = await response.json() as VerifyResponse
        
        console.log('Verify response:', data)

        if (data.success && data.token) {
          router.push(`/upload/${data.token}`)
          return
        }

        if (data.status === 'pending') {
          return // Keep polling
        }

        setError(data.message || 'Verification failed')
      } catch (err) {
        console.error('Verification error:', err)
        setError(err instanceof Error ? err.message : 'Failed to verify payment')
      }
    }

    // Set up polling with const declarations
    const intervalId = setInterval(verifyPayment, 2000)
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId)
      setError('Payment verification timed out')
    }, 30000)

    // Cleanup function
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

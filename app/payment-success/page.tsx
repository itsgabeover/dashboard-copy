"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { ReactElement } from "react"

type VerifyResponse = {
  success: boolean
  status?: string
  message?: string
  token?: string
}

function PaymentProcessor(): ReactElement {
  console.log("PaymentProcessor mounted")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    console.log("PaymentProcessor useEffect started")

    const verifyPayment = async (): Promise<void> => {
      try {
        const sessionId = searchParams?.get("session_id")
        console.log("Attempting verification with session ID:", sessionId)

        if (!sessionId) {
          throw new Error("No session ID provided")
        }

        const response = await fetch(`/api/verify-payment?session_id=${sessionId}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = (await response.json()) as VerifyResponse

        console.log("Verify response:", data)
        console.log("Current URL:", window.location.href)

        if (data.success && data.token) {
          console.log("Success condition met, redirecting to:", `/upload/${data.token}`)
          try {
            await router.replace(`/upload/${data.token}`)
            console.log("Navigation completed")
          } catch (error) {
            console.error("Navigation failed:", error)
          }
          return
        }

        if (data.status === "pending") {
          console.log("Payment still pending")
          return
        }

        setError(data.message || "Verification failed")
      } catch (err) {
        console.error("Verification error:", err)
        if (err instanceof Error) {
          console.error("Error message:", err.message)
          console.error("Error stack:", err.stack)
        } else {
          console.error("Unknown error:", err)
        }
        setError(err instanceof Error ? err.message : "Failed to verify payment")
      }
    }

    if (searchParams) {
      console.log("Setting up interval for payment verification")
      const intervalId = setInterval(verifyPayment, 2000)

      // Run initial verification
      void verifyPayment()

      const timeoutId = setTimeout(() => {
        console.log("Verification timed out")
        clearInterval(intervalId)
        setError("Payment verification timed out")
      }, 30000)

      return () => {
        console.log("PaymentProcessor cleanup running")
        clearInterval(intervalId)
        clearTimeout(timeoutId)
      }
    }
  }, [router, searchParams])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">Error Processing Payment</h1>
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
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600">Processing your payment...</p>
      </div>
    </div>
  )
}

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

export default function PaymentSuccessPage(): ReactElement {
  return (
    <Suspense fallback={<LoadingPage />}>
      <PaymentProcessor />
    </Suspense>
  )
}


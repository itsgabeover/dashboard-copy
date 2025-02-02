"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { fetchPolicyData } from "@/lib/api"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import type { ParsedPolicyData } from "@/types/policy"

export default function ProcessingPage() {
  const router = useRouter()
  const [attempts, setAttempts] = useState(0)
  const [lastAttemptTime, setLastAttemptTime] = useState<Date | null>(null)
  const maxAttempts = 30 // 5 minutes with 10-second intervals

  useEffect(() => {
    const checkProcessingStatus = async () => {
      try {
        // Update last attempt time
        setLastAttemptTime(new Date())
        
        const data = await fetchPolicyData()
        if (data) {
          console.log("Policy data found, redirecting to dashboard")
          router.push('/dashboard')
          return
        }

        // If still processing and not exceeded max attempts
        if (attempts < maxAttempts) {
          setAttempts(prev => prev + 1)
          setTimeout(checkProcessingStatus, 10000) // Check every 10 seconds
        } else {
          console.log("Max attempts reached, redirecting to timeout")
          router.push('/upload/timeout')
        }
      } catch (error) {
        console.error('Error checking status:', error)
        if (attempts < maxAttempts) {
          setAttempts(prev => prev + 1)
          setTimeout(checkProcessingStatus, 10000)
        } else {
          router.push('/upload/timeout')
        }
      }
    }

    checkProcessingStatus()
  }, [attempts, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <LoadingSpinner />
      <h2 className="mt-8 text-2xl font-semibold text-gray-800">Processing Your Policy</h2>
      <p className="mt-4 text-gray-600">
        This typically takes 2-3 minutes. We'll redirect you automatically when ready.
      </p>
      <div className="mt-4 text-sm text-gray-500">
        <p>Attempt {attempts + 1} of {maxAttempts}</p>
        {lastAttemptTime && (
          <p>Last check: {lastAttemptTime.toLocaleTimeString()}</p>
        )}
      </div>
    </div>
  )
}

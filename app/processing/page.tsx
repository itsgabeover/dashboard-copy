"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { fetchPolicyData } from "@/lib/api"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function ProcessingPage() {
  const router = useRouter()
  const [attempts, setAttempts] = useState(0)
  const [lastAttemptTime, setLastAttemptTime] = useState<Date | null>(null)
  const [processingStage, setProcessingStage] = useState(1)
  const maxAttempts = 30 // 5 minutes with 10-second intervals

  // Processing stages
  const stages = [
    { id: 1, text: "Uploading document..." },
    { id: 2, text: "Converting to text..." },
    { id: 3, text: "AI analyzing policy..." },
    { id: 4, text: "Preparing your dashboard..." }
  ]

  useEffect(() => {
    console.log("Processing page mounted")

    // Advance through stages every 12 seconds
    const stageInterval = setInterval(() => {
      setProcessingStage(prev => prev < stages.length ? prev + 1 : prev)
    }, 12000)

    const checkProcessingStatus = async () => {
      try {
        setLastAttemptTime(new Date())
        
        const data = await fetchPolicyData()
        if (data) {
          console.log("Policy data found, redirecting to dashboard")
          router.push('/dashboard')
          return
        }

        if (attempts < maxAttempts) {
          setAttempts(prev => prev + 1)
          setTimeout(checkProcessingStatus, 10000)
        } else {
          console.log("Max attempts reached, staying on processing page")
          // Instead of redirecting, we'll stay here and keep trying
          setAttempts(0) // Reset attempts
        }
      } catch (error) {
        console.error('Error checking status:', error)
        if (attempts < maxAttempts) {
          setAttempts(prev => prev + 1)
          setTimeout(checkProcessingStatus, 10000)
        }
      }
    }

    checkProcessingStatus()

    return () => {
      clearInterval(stageInterval)
      clearTimeout(setTimeout(checkProcessingStatus, 10000))
    }
  }, [attempts, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="max-w-md w-full mx-auto p-8">
        <LoadingSpinner />
        
        <div className="mt-8 space-y-6">
          {stages.map((stage) => (
            <div 
              key={stage.id} 
              className={`flex items-center space-x-4 transition-all duration-500 ${
                stage.id <= processingStage ? 'opacity-100' : 'opacity-30'
              }`}
            >
              <div className={`w-4 h-4 rounded-full ${
                stage.id < processingStage ? 'bg-green-500' : 
                stage.id === processingStage ? 'bg-blue-500 animate-pulse' : 
                'bg-gray-300'
              }`} />
              <span className={`text-lg ${
                stage.id === processingStage ? 'text-blue-600 font-semibold' : 
                stage.id < processingStage ? 'text-green-600' : 
                'text-gray-400'
              }`}>
                {stage.text}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            This process typically takes 45-60 seconds.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            We&apos;ll automatically redirect you when ready.
          </p>
        </div>

        {lastAttemptTime && (
          <div className="mt-4 text-xs text-gray-400 text-center">
            Last check: {lastAttemptTime.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  )
}

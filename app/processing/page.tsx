"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { fetchPolicyData } from "@/lib/api"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function ProcessingPage() {
  const router = useRouter()
  const [processingTime, setProcessingTime] = useState(0)
  const [processingStage, setProcessingStage] = useState(1)

  // Processing stages
  const stages = [
    { id: 1, text: "Uploading document..." },
    { id: 2, text: "Converting to text..." },
    { id: 3, text: "AI analyzing policy..." },
    { id: 4, text: "Preparing your dashboard..." },
  ]

  useEffect(() => {
    console.log("Processing page mounted")

    const minWaitTime = 60000 // 60 seconds
    const startTime = Date.now()

    // Advance through stages every 15 seconds
    const stageInterval = setInterval(() => {
      setProcessingStage((prev) => (prev < stages.length ? prev + 1 : prev))
    }, 15000)

    // Increment processing time every second
    const timeInterval = setInterval(() => {
      setProcessingTime((prev) => prev + 1)
    }, 1000)

    const checkProcessingStatus = async () => {
      try {
        const currentTime = Date.now()
        if (currentTime - startTime < minWaitTime) {
          // If minimum wait time hasn't elapsed, check again after the remaining time
          setTimeout(checkProcessingStatus, minWaitTime - (currentTime - startTime))
          return
        }

        const data = await fetchPolicyData()
        if (data) {
          console.log("Policy data found, redirecting to dashboard")
          router.push("/dashboard")
          return
        }

        // If no data found, wait 10 seconds before checking again
        setTimeout(checkProcessingStatus, 10000)
      } catch (error) {
        console.error("Error checking status:", error)
        // If error occurs, wait 10 seconds before checking again
        setTimeout(checkProcessingStatus, 10000)
      }
    }

    checkProcessingStatus()

    return () => {
      clearInterval(stageInterval)
      clearInterval(timeInterval)
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="max-w-md w-full mx-auto p-8">
        <LoadingSpinner />

        <div className="mt-8 space-y-6">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className={`flex items-center space-x-4 transition-all duration-500 ${
                stage.id <= processingStage ? "opacity-100" : "opacity-30"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full ${
                  stage.id < processingStage
                    ? "bg-green-500"
                    : stage.id === processingStage
                      ? "bg-blue-500 animate-pulse"
                      : "bg-gray-300"
                }`}
              />
              <span
                className={`text-lg ${
                  stage.id === processingStage
                    ? "text-blue-600 font-semibold"
                    : stage.id < processingStage
                      ? "text-green-600"
                      : "text-gray-400"
                }`}
              >
                {stage.text}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">This process typically takes 60-90 seconds.</p>
          <p className="text-sm text-gray-500 mt-2">We'll automatically redirect you when ready.</p>
        </div>

        <div className="mt-4 text-xs text-gray-400 text-center">Processing time: {processingTime} seconds</div>
      </div>
    </div>
  )
}


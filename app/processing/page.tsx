"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

const stages = ["Analyzing Policy", "Extracting Insights", "Generating Report", "Finalizing"]

export default function ProcessingPage() {
  const [currentStage, setCurrentStage] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setCurrentStage((prevStage) => (prevStage + 1) % stages.length)
    }, 12000)

    const checkPolicy = async () => {
      try {
        const response = await fetch("/api/policy")
        if (response.ok) {
          const data = await response.json()
          if (data.status === "complete") {
            clearInterval(stageInterval)
            router.push("/portal")
          }
        }
      } catch (error) {
        console.error("Error checking policy status:", error)
      }

      setAttempts((prevAttempts) => prevAttempts + 1)
    }

    const pollingInterval = setInterval(() => {
      if (attempts < 30) {
        checkPolicy()
      } else {
        clearInterval(pollingInterval)
        clearInterval(stageInterval)
        router.push("/error")
      }
    }, 10000)

    return () => {
      clearInterval(stageInterval)
      clearInterval(pollingInterval)
    }
  }, [router, attempts])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="text-center">
        <LoadingSpinner size={48} className="mb-8 text-[#4B6FEE]" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{stages[currentStage]}</h1>
        <p className="text-lg text-gray-600">Please wait while we process your policy...</p>
      </div>
    </div>
  )
}


"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import UploadSuccess from "@/components/upload-success"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function UploadSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const uploadId = searchParams.get("uploadId")
  const [isAnalyzing, setIsAnalyzing] = useState(true)

  useEffect(() => {
    if (!uploadId) {
      router.push("/")
      return
    }

    const checkAnalysisStatus = async () => {
      try {
        const response = await fetch(`/api/analysis-status?uploadId=${uploadId}`)
        const data = await response.json()

        if (data.status === "completed") {
          router.push(`/dashboard/${data.policyId}`)
        } else {
          setTimeout(checkAnalysisStatus, 5000) // Check every 5 seconds
        }
      } catch (error) {
        console.error("Error checking analysis status:", error)
        setIsAnalyzing(false)
      }
    }

    checkAnalysisStatus()
  }, [uploadId, router])

  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="mt-4 text-lg text-gray-600">Analyzing your policy...</p>
        <p className="mt-2 text-sm text-gray-500">This may take a few minutes. Please don&apos;t close this page.</p>
      </div>
    )
  }

  return <UploadSuccess />
}


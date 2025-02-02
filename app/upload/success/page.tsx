"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function SuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Short delay before redirecting to processing
    const timeout = setTimeout(() => {
      router.push('/processing')
    }, 1500)

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <LoadingSpinner />
      <h2 className="mt-8 text-2xl font-semibold text-gray-800">Upload Successful!</h2>
      <p className="mt-4 text-gray-600">
        Redirecting to process your policy...
      </p>
    </div>
  )
}

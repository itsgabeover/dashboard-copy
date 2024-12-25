'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import { UploadInterface } from '@/components/UploadInterface'

// Loading component for Suspense fallback
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

// Main upload component
function UploadComponent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      router.replace('/pre-payment-info')
    }
  }, [token, router])

  if (!token) {
    return null
  }

  return <UploadInterface token={token} />
}

// Main page component with Suspense boundary
export default function UploadPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <UploadComponent />
    </Suspense>
  )
}

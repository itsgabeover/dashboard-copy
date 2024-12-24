'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { UploadInterface } from '@/components/UploadInterface'

export default function UploadPage() {
  const searchParams = useSearchParams()!
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
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Page({ 
  params 
}: { 
  params: { token: string } 
}) {
  const router = useRouter()

  useEffect(() => {
    if (params.token) {
      sessionStorage.setItem('upload_token', params.token)
      router.push('/upload')
    } else {
      router.push('/')
    }
  }, [params.token, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B6FEE]" />
    </div>
  )
}

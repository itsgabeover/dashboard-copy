'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface PageProps {
  params: {
    token: string
  }
}

export default function Page({ 
  params,
}: PageProps) {
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
      <div 
        className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B6FEE]" 
        aria-label="Loading"
      />
    </div>
  )
}

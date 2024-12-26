// app/upload/[token]/page.tsx
'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type PageProps = {
  params: {
    token: string
  }
}

export default function TokenHandlerPage({ params }: PageProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (params.token) {
      try {
        sessionStorage.setItem('upload_token', params.token)
        router.push('/upload')
      } catch (error) {
        console.error('Storage error:', error)
        router.push('/')
      }
    }
  }, [params.token, router])

  // Prevent hydration issues
  if (!mounted) {
    return null
  }

  // Fallback UI while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Preparing upload...</p>
    </div>
  )
}

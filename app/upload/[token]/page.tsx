'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface PageProps {
  params: Promise<{ token: string }> | { token: string }
}

export default function TokenHandlerPage({ params }: PageProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    async function handleToken() {
      try {
        // Handle if params is a Promise
        const resolvedParams = await Promise.resolve(params)
        if (resolvedParams.token) {
          sessionStorage.setItem('upload_token', resolvedParams.token)
          router.push('/upload')
        }
      } catch {
        router.push('/')
      }
    }

    setMounted(true)
    handleToken()
  }, [params, router])

  if (!mounted) return null

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B6FEE]" />
    </div>
  )
}

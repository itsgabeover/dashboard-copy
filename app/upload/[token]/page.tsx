// TokenHandler.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function TokenHandler({ token }: { token: string }) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (mounted && token) {
      sessionStorage.setItem('upload_token', token)
      router.push('/upload')
    }
  }, [mounted, token, router])

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B6FEE]" />
    </div>
  )
}

// page.tsx
import TokenHandler from './TokenHandler'

export default function Page({ params }: { params: { token: string } }) {
  return <TokenHandler token={params.token} />
}

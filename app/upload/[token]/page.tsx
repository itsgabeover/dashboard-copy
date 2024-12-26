// app/upload/[token]/page.tsx
import { TokenHandler } from './TokenHandler'

export default function Page({ 
  params 
}: { 
  params: { token: string } 
}) {
  return <TokenHandler token={params.token} />
}

// app/upload/[token]/TokenHandler.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function TokenHandler({ token }: { token: string }) {
  const router = useRouter()

  useEffect(() => {
    if (token) {
      sessionStorage.setItem('upload_token', token)
      router.push('/upload')
    } else {
      router.push('/')
    }
  }, [token, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B6FEE]" />
    </div>
  )
}

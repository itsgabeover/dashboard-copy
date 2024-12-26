// app/upload/[token]/page.tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function UploadWithTokenPage({ 
  params 
}: { 
  params: { token: string } 
}) {
  const router = useRouter()

  useEffect(() => {
    sessionStorage.setItem('upload_token', params.token)
    router.push('/upload')
  }, [router, params.token])

  return null
}

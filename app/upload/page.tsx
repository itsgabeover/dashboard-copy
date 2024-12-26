// app/upload/[token]/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type PageProps = {
  params: {
    token: string
  }
}

export default function Page({ params }: PageProps) {
  const router = useRouter()

  useEffect(() => {
    if (params.token) {
      sessionStorage.setItem('upload_token', params.token)
      router.push('/upload')
    }
  }, [router, params.token])

  return null
}

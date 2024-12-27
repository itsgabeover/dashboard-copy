'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { use } from 'react'

type PageProps = {
  params: Promise<{ token: string }>
}

export default function Page({ params }: PageProps) {
  const router = useRouter()
  const { token } = use(params)

  useEffect(() => {
    if (token) {
      sessionStorage.setItem('upload_token', token)
      router.push('/upload')
    }
  }, [router, token])

  return null
}

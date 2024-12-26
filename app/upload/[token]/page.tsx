// app/upload/[token]/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type PageProps = {
  params: { token: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

const Page = (props: PageProps) => {
  const router = useRouter()
  const { token } = props.params

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

export default Page

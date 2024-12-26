'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type Props = {
  params: {
    token: string
  }
}

export default function Page(props: Props) {
  const router = useRouter()
  const token = props.params.token
  
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
      <div 
        className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B6FEE]" 
        aria-label="Loading"
      />
    </div>
  )
}

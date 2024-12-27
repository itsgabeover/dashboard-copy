'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { use } from 'react'

export default function Page({ 
  params 
}: { 
  params: Promise<{ token: string }> 
}) {
  const router = useRouter()
  const { token } = use(params)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    if (token) {
      sessionStorage.setItem('upload_token', token)
      setIsLoading(false)
    } else {
      router.push('/')
    }
  }, [token, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div 
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B6FEE]" 
          aria-label="Loading"
        />
      </div>
    )
  }

  // Return upload interface when not loading
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <h1>Upload Your Documents</h1>
        {/* Add your upload interface here */}
      </div>
    </div>
  )
}

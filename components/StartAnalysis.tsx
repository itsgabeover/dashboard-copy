'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function StartAnalysis() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleStart = () => {
    setIsLoading(true)
    router.push('/upload')
  }

  return (
    <button
      onClick={handleStart}
      disabled={isLoading}
      className="bg-[#4B6FEE] hover:bg-[#3B4FDE] text-white font-bold py-3 px-6 rounded-lg transition-colors"
    >
      {isLoading ? 'Loading...' : 'Start Your Analysis'}
    </button>
  )
} 

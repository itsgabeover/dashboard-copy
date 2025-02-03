'use client'

import { useEffect } from 'react'

export default function PortalPage() {
  useEffect(() => {
    console.log('Portal page mounted on client')
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-8">Portal Test</h1>
        <p>Timestamp: {Date.now()}</p>
      </main>
    </div>
  )
}

// app/portal/loading.tsx
export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-lg">Loading...</div>
    </div>
  )
}

// app/portal/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Portal Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h2 className="text-xl font-bold mb-4">Something went wrong!</h2>
      <pre className="bg-gray-100 p-4 rounded mb-4">{error.message}</pre>
      <button 
        onClick={reset}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  )
}

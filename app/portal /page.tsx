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

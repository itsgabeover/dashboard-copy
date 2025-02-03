import { Suspense } from "react"
import dynamic from 'next/dynamic'
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Dynamically import PortalContent with no SSR
const PortalContent = dynamic(() => import("@/components/PortalContent"), {
  ssr: false,
  loading: () => <LoadingSpinner size="lg" />
})

export default function PortalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-8">My Policy Analysis Portal</h1>
        <PortalContent />
      </main>
    </div>
  )
}

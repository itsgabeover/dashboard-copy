import { Suspense } from "react"
import PortalContent from "@/components/PortalContent"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function PortalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-8">My Policy Analysis Portal</h1>
        <Suspense fallback={<LoadingSpinner size="lg" />}>
          <PortalContent />
        </Suspense>
      </main>
    </div>
  )
}

import { Suspense } from "react"
import PortalContent from "@/components/PortalContent"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Make sure to export as default
export default function PortalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-8">My Policy Analysis Portal</h1>
        <Suspense
          fallback={
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          }
        >
          <PortalContent />
        </Suspense>
      </main>
    </div>
  )
}


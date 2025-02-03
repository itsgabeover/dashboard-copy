import { Suspense } from "react"
import PortalContent from "@/components/PortalContent"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Policy Analysis Portal",
    description: "View your policy analyses",
    other: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  }
}

export default function Portal2Page() {
  console.log("Portal2 page component rendered")

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


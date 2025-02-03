import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function PortalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <h2 className="text-xl font-semibold text-blue-800">Loading Portal...</h2>
        <p className="text-sm text-gray-600">Please wait while we fetch your policy analyses</p>
      </div>
    </div>
  )
}


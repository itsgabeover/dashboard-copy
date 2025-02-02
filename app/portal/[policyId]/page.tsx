import { Suspense } from "react"
import PolicyOverview from "@/components/PolicyOverview"
import SectionAnalysis from "@/components/SectionAnalysis"
import InsightFramework from "@/components/InsightFramework"
import KeyTakeaways from "@/components/KeyTakeaways"
import { fetchPolicyData } from "@/lib/api"
import type { ParsedPolicyData } from "@/types/policy"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

async function PolicyPageContent({ policyId }: { policyId: string }) {
  let policyData: ParsedPolicyData | null = null
  let error: string | null = null

  try {
    const response = await fetchPolicyData(policyId)

    if (response?.success && response.data) {
      policyData = response.data
    } else {
      error = "No policy data available"
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load policy data"
    console.error("Error loading policy:", err)
  }

  if (error || !policyData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-50">
        <div className="text-center text-red-600 p-6">{error || "No policy data available"}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <main className="container mx-auto px-4 py-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Policy Analysis Dashboard</h1>
          <div className="text-sm text-gray-500">
            Last updated: {new Date(policyData.timestamp).toLocaleDateString()}
          </div>
        </div>
        <PolicyOverview {...policyData.data.policyOverview} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SectionAnalysis sections={policyData.data.sections} selectedSectionIndex={0} onSectionChange={() => {}} />
          </div>
          <div>
            <InsightFramework section={policyData.data.sections[0]} />
          </div>
        </div>
        <KeyTakeaways section={policyData.data.sections[0]} />
        {policyData.data.finalThoughts && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Final Thoughts</h2>
            <p className="text-gray-700">{policyData.data.finalThoughts}</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default async function PolicyPage({ params }: { params: { policyId: string } }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PolicyPageContent policyId={params.policyId} />
    </Suspense>
  )
}


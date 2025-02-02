import { Suspense } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import PolicyOverview from "@/components/PolicyOverview"
import SectionAnalysis from "@/components/SectionAnalysis"
import InsightFramework from "@/components/InsightFramework"
import KeyTakeaways from "@/components/KeyTakeaways"
import { supabase } from "@/lib/supabase"
import type { ParsedPolicyData } from "@/types/policy"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Define props type for NextJS page component
type PageProps = {
  params: {
    policyId: string
  }
}

async function PolicyContent({ policyId }: { policyId: string }) {
  const { data: policy, error } = await supabase.from("policies").select("*").eq("id", policyId).single()

  if (error) throw error
  if (!policy?.analysis_data) {
    throw new Error("Policy not found")
  }

  const policyData: ParsedPolicyData = policy.analysis_data

  return (
    <>
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
    </>
  )
}

export default function Page({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <main className="container mx-auto px-4 py-4 space-y-6">
        <Link href="/portal" className="inline-flex items-center text-[#4B6FEE] hover:text-[#3B4FDE]">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Policies
        </Link>

        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Policy Analysis Dashboard</h1>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <PolicyContent policyId={params.policyId} />
        </Suspense>
      </main>
    </div>
  )
}


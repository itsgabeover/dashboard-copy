import { Suspense } from "react"
import { notFound } from "next/navigation"
import PolicyOverview from "@/components/PolicyOverview"
import SectionAnalysis from "@/components/SectionAnalysis"
import InsightFramework from "@/components/InsightFramework"
import KeyTakeaways from "@/components/KeyTakeaways"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import type { ParsedPolicyData } from "@/types/policy"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

async function getPolicyData(policyId: string): Promise<ParsedPolicyData | null> {
  const { data, error } = await supabase.from("policies").select("*").eq("id", policyId).single()

  if (error) {
    console.error("Error fetching policy:", error)
    return null
  }

  return data as ParsedPolicyData
}

export default async function PolicyPage({ params }: { params: { policyId: string } }) {
  const policyData = await getPolicyData(params.policyId)

  if (!policyData) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <main className="container mx-auto px-4 py-8">
        <Button onClick={() => window.history.back()} className="mb-6 bg-[#4B6FEE] text-white hover:bg-[#3B4FDE]">
          Back to Portal
        </Button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Policy Analysis: {policyData.data.policyOverview.policyName}
        </h1>

        <Suspense fallback={<LoadingSpinner />}>
          <PolicyOverview {...policyData.data.policyOverview} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2">
              <SectionAnalysis
                sections={policyData.data.sections}
                selectedSectionIndex={0}
                onSectionChange={() => {}}
              />
            </div>
            <div>
              <InsightFramework section={policyData.data.sections[0]} />
            </div>
          </div>

          <KeyTakeaways section={policyData.data.sections[0]} />

          {policyData.data.finalThoughts && (
            <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Final Thoughts</h2>
              <p className="text-gray-700">{policyData.data.finalThoughts}</p>
            </div>
          )}
        </Suspense>
      </main>
    </div>
  )
}


"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import PolicyOverview from "@/components/PolicyOverview"
import SectionAnalysis from "@/components/SectionAnalysis"
import InsightFramework from "@/components/InsightFramework"
import KeyTakeaways from "@/components/KeyTakeaways"
import { fetchPolicyData } from "@/lib/api"
import type { ParsedPolicyData } from "@/types/policy"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { MyPortalButton } from "@/components/MyPortalButton"
import Link from "next/link"

export default function Dashboard() {
  const router = useRouter()
  const [policyData, setPolicyData] = useState<ParsedPolicyData | null>(null)
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPolicyData() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchPolicyData()
        if (data) {
          setPolicyData(data)
        } else {
          // If no data is available, redirect to the processing page
          router.push("/processing")
          return
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load policy data")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadPolicyData()
  }, [router])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error || !policyData) {
    return <div className="text-center text-red-600 p-6">{error || "No policy data available"}</div>
  }

  const selectedSection = policyData.data.sections[selectedSectionIndex]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <header className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Policy Analysis Dashboard</h1>
        <div className="flex items-center space-x-4">
          <MyPortalButton />
          <Link href="/portal2" className="btn btn-primary">
            Go to Portal 2
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-4 space-y-6">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Last updated: {new Date(policyData.timestamp).toLocaleDateString()}
          </div>
        </div>

        <PolicyOverview policyOverview={policyData.data.policyOverview} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SectionAnalysis
              sections={policyData.data.sections}
              selectedSectionIndex={selectedSectionIndex}
              onSectionChange={setSelectedSectionIndex}
            />
          </div>
          <div>
            <InsightFramework section={selectedSection} />
          </div>
        </div>

        <KeyTakeaways section={selectedSection} />

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


"use client"

import { useState } from "react"
// import { useRouter } from "next/navigation"
import PolicyOverview from "@/components/PolicyOverview"
import SectionAnalysis from "@/components/SectionAnalysis"
import InsightFramework from "@/components/InsightFramework"
import KeyTakeaways from "@/components/KeyTakeaways"
import type { ParsedPolicyData } from "@/types/policy"
import { MyPortalButton } from "@/components/MyPortalButton"
import Link from "next/link"

interface DashboardProps {
  policyData: ParsedPolicyData
}

export default function Dashboard({ policyData }: DashboardProps) {
  // const router = useRouter()
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0)

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


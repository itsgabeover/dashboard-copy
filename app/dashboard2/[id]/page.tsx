"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import PolicyOverview from "@/components/PolicyOverview"
import SectionAnalysis from "@/components/SectionAnalysis"
import InsightFramework from "@/components/InsightFramework"
import KeyTakeaways from "@/components/KeyTakeaways"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { MyPortalButton } from "@/components/MyPortalButton"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Section {
  title: string
  content: string
  analysis: string
  insights: {
    key: string
    explanation: string
  }[]
}

interface PolicyData {
  timestamp: string
  data: {
    policyOverview: {
      title: string
      summary: string
      keyPoints: string[]
    }
    sections: Section[]
    finalThoughts?: string
  }
}

async function fetchPolicyData(id: string): Promise<PolicyData> {
  const response = await fetch(`/api/policy-analyses/${id}`)
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Policy analysis not found")
    }
    throw new Error("Failed to fetch policy data")
  }
  return response.json()
}

export default function Dashboard2() {
  const params = useParams()
  const router = useRouter()
  const policyId = params.id as string

  const [policyData, setPolicyData] = useState<PolicyData | null>(null)
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!policyId) {
      setError("No policy ID provided")
      setIsLoading(false)
      return
    }

    async function loadPolicyData() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchPolicyData(policyId)
        if (data) {
          setPolicyData(data)
        } else {
          router.push("/processing")
          return
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load policy data")
        console.error("Error loading policy data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadPolicyData()
  }, [policyId, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link 
            href="/portal2" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Return to Portal 2
          </Link>
        </div>
      </div>
    )
  }

  if (!policyData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>No policy data available</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link 
            href="/portal2" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Return to Portal 2
          </Link>
        </div>
      </div>
    )
  }

  const selectedSection = policyData.data.sections[selectedSectionIndex]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm border-b z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Policy Analysis Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <MyPortalButton />
            <Link 
              href="/portal2" 
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Return to Portal 2
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
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
          <div className="space-y-6">
            <InsightFramework section={selectedSection} />
          </div>
        </div>

        <KeyTakeaways section={selectedSection} />

        {policyData.data.finalThoughts && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Final Thoughts
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {policyData.data.finalThoughts}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

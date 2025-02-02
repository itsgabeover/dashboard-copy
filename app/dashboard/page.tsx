"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import PolicyOverview from "@/components/PolicyOverview"
import SectionAnalysis from "@/components/SectionAnalysis"
import InsightFramework from "@/components/InsightFramework"
import KeyTakeaways from "@/components/KeyTakeaways"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { fetchPolicyData } from "@/lib/api"
import type { ParsedPolicyData } from "@/types/policy"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function Dashboard() {
  const params = useParams()
  const [policyData, setPolicyData] = useState<ParsedPolicyData | null>(null)
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPolicyData() {
      if (!params.policyId) return

      try {
        setIsLoading(true)
        setError(null)

        // Try to get data from localStorage first
        const storedData = localStorage.getItem(`policy_${params.policyId}`)
        if (storedData) {
          console.log("Loading data from localStorage")
          const parsedData = JSON.parse(storedData)
          setPolicyData(parsedData)
          setIsLoading(false)
          return
        }

        // If not in localStorage, fetch from API
        console.log("Fetching data from API")
        const data = await fetchPolicyData(params.policyId as string)
        setPolicyData(data)

        // Store the fetched data in localStorage
        localStorage.setItem(`policy_${params.policyId}`, JSON.stringify(data))
      } catch (err) {
        console.error("Error loading policy data:", err)
        setError(err instanceof Error ? err.message : "Failed to load policy data")
      } finally {
        setIsLoading(false)
      }
    }

    loadPolicyData()
  }, [params.policyId])

  // Handler for updating policy data
  const updatePolicyData = async (newData: ParsedPolicyData) => {
    try {
      setPolicyData(newData)
      // Update localStorage when data changes
      if (params.policyId) {
        localStorage.setItem(`policy_${params.policyId}`, JSON.stringify(newData))
      }
    } catch (err) {
      console.error("Error updating policy data:", err)
      setError(err instanceof Error ? err.message : "Failed to update policy data")
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error || !policyData) {
    return <div className="text-center text-red-600 p-6">{error || "No policy data available"}</div>
  }

  const selectedSection = policyData.data.sections[selectedSectionIndex]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#4B6FEE] font-bold text-xl">IP-AI</span>
            <span className="text-gray-700">Insurance Planner AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/why-review" className="text-gray-600 hover:text-gray-900">
              Why Review?
            </Link>
            <Link href="/help" className="text-gray-600 hover:text-gray-900">
              Help Center
            </Link>
            <Button className="bg-[#4B6FEE] hover:bg-[#3B4FDE] text-white rounded-full px-6">
              <MessageCircle className="w-4 h-4 mr-2" />
              Ask Our AI Helper
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Policy Analysis Dashboard</h1>
          <div className="text-sm text-gray-500">
            Policy ID: {params.policyId}
            <br />
            Last updated: {new Date(policyData.timestamp).toLocaleDateString()}
          </div>
        </div>

        <PolicyOverview {...policyData.data.policyOverview} />

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

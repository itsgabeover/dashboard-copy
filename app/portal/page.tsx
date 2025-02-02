"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface Policy {
  id: string
  created_at: string
  status: string
  productName: string
  analysis_data: {
    policyName: string
  }
}

export default function PortalPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await fetch("/api/policy")
        if (response.ok) {
          const data = await response.json()
          setPolicies(data)
        }
      } catch (error) {
        console.error("Error fetching policies:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPolicies()
  }, [])

  if (isLoading) {
    return <LoadingSpinner />
  }

  const latestPolicy = policies[0]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Policy Analysis Portal</h1>

        {latestPolicy && (
          <Card className="mb-8 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Latest Policy Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">{latestPolicy.analysis_data.policyName}</h2>
              <p className="text-gray-600 mb-2">
                Uploaded on: {new Date(latestPolicy.created_at).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mb-4">Status: {latestPolicy.status}</p>
              <Link href={`/portal/${latestPolicy.id}`} className="text-[#4B6FEE] hover:text-[#3B4FDE] font-medium">
                View Full Analysis
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.slice(1).map((policy) => (
            <Card key={policy.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">{policy.analysis_data.policyName}</h3>
                <p className="text-gray-600 mb-2">Uploaded on: {new Date(policy.created_at).toLocaleDateString()}</p>
                <p className="text-gray-600 mb-4">Status: {policy.status}</p>
                <Link href={`/portal/${policy.id}`} className="text-[#4B6FEE] hover:text-[#3B4FDE] font-medium">
                  View Analysis
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}


"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight, AlertCircle, Upload } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface Policy {
  id: string
  policy_name: string
  insurer: string
  policy_type: string
  death_benefit: number
  uploaded_at: string
  status: string
}

export default function PortalContent() {
  const router = useRouter()
  const [data, setData] = useState<Policy[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPolicies() {
      try {
        const response = await fetch("/api/policy-analyses", {
          cache: "no-store",
          headers: {
            Pragma: "no-cache",
          },
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch policies")
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load policies")
        console.error("Error fetching policies:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPolicies()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h3 className="text-xl font-semibold text-gray-900">Unable to Load Policies</h3>
          <p className="text-gray-600 text-center max-w-md">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Upload className="h-12 w-12 text-blue-500" />
          <h3 className="text-xl font-semibold text-gray-900">No Policies Yet</h3>
          <p className="text-gray-600 text-center max-w-md">
            Upload your first policy illustration to get started with AI-powered analysis.
          </p>
          <Button onClick={() => router.push("/upload")}>Upload Policy</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.map((policy) => (
        <Card key={policy.id} className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex justify-between items-center">
              <span className="text-lg font-semibold text-blue-800">{policy.policy_name}</span>
              <span className="text-sm text-gray-500 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(policy.uploaded_at).toLocaleDateString()}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2">
              {policy.insurer && (
                <p className="text-sm text-gray-600">
                  <strong>Insurer:</strong> {policy.insurer}
                </p>
              )}
              {policy.policy_type && (
                <p className="text-sm text-gray-600">
                  <strong>Policy Type:</strong> {policy.policy_type}
                </p>
              )}
              {policy.death_benefit && (
                <p className="text-sm text-gray-600">
                  <strong>Death Benefit:</strong> ${policy.death_benefit.toLocaleString()}
                </p>
              )}
            </div>
            <Button className="mt-4 w-full" onClick={() => router.push(`/dashboard/${policy.id}`)}>
              View Full Analysis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


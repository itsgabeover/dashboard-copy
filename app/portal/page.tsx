"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { supabase } from '@/lib/supabase'
import type { ParsedPolicyData } from "@/types/policy"

interface PolicyListing {
  id: string
  productName: string
  created_at: string
  status: 'processing' | 'complete' | 'error'
  analysis_data: ParsedPolicyData
}

export default function PortalPage() {
  const [policies, setPolicies] = useState<PolicyListing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPolicies() {
      try {
        const { data, error } = await supabase
          .from('policies')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        setPolicies(data || [])
      } catch (err) {
        console.error('Error fetching policies:', err)
        setError('Failed to load policies')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPolicies()
  }, [])

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'processing':
        return <Clock className="h-5 w-5 text-[#4B6FEE] animate-pulse" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const latestPolicy = policies[0]
  const olderPolicies = policies.slice(1)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#4B6FEE] to-[#3B4FDE]">
            Your Policy Analyses
          </h1>
          <p className="text-lg text-gray-600">
            View and manage your insurance policy analyses
          </p>
        </div>

        {policies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No policies found</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Latest Policy */}
            {latestPolicy && (
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Latest Analysis</CardTitle>
                    {getStatusIcon(latestPolicy.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <FileText className="h-8 w-8 text-[#4B6FEE]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {latestPolicy.analysis_data.data.policyOverview.productName}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Uploaded {new Date(latestPolicy.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Link 
                      href={`/portal/${latestPolicy.id}`}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-[#4B6FEE] text-white hover:bg-[#3B4FDE] transition-colors"
                    >
                      View Analysis
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Previous Policies Grid */}
            {olderPolicies.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {olderPolicies.map(policy => (
                  <Card 
                    key={policy.id}
                    className="border bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <FileText className="h-6 w-6 text-[#4B6FEE]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">
                              {policy.analysis_data.data.policyOverview.productName}
                            </h3>
                            {getStatusIcon(policy.status)}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(policy.created_at).toLocaleDateString()}
                          </p>
                          <Link
                            href={`/portal/${policy.id}`}
                            className="inline-flex items-center mt-3 text-[#4B6FEE] hover:text-[#3B4FDE] hover:underline"
                          >
                            View Analysis →
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

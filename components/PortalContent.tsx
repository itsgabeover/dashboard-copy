"use client"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface PolicyAnalysis {
  id: string
  policy_name: string
  insurer: string
  policy_type: string
  death_benefit: number
  uploaded_at: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function PortalContent() {
  const router = useRouter()
  const { data, error, isLoading } = useSWR<PolicyAnalysis[]>("/api/policy-analyses", fetcher)

  if (isLoading) return <LoadingSpinner />
  if (error) return <div className="text-red-500">Failed to load policy analyses</div>

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data &&
        data.map((analysis) => (
          <Card key={analysis.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex justify-between items-center">
                <span className="text-lg font-semibold text-blue-800">{analysis.policy_name}</span>
                <span className="text-sm text-gray-500 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(analysis.uploaded_at).toLocaleDateString()}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Insurer:</strong> {analysis.insurer}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Policy Type:</strong> {analysis.policy_type}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Death Benefit:</strong> ${analysis.death_benefit.toLocaleString()}
                </p>
              </div>
              <Button className="mt-4 w-full" onClick={() => router.push(`/dashboard/${analysis.id}`)}>
                View Full Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
    </div>
  )
}


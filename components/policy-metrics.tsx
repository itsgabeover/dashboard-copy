import { Card } from "@/components/ui/card"
import { FileText, Heart, DollarSign } from "lucide-react"
import type { PolicyOverviewData } from "@/types/policy-dashboard"

interface PolicyMetricsProps {
  policyData: PolicyOverviewData
}

export function PolicyMetrics({ policyData }: PolicyMetricsProps) {
  // Format currency helper
  const formatCurrency = (value: string | undefined) => {
    if (!value) return "N/A"
    // Remove any existing formatting (like $ and commas)
    const numericValue = Number(value.replace(/[^0-9.-]+/g,""))
    if (isNaN(numericValue)) return "N/A"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericValue)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-blue-100 p-3 mb-2">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Policy Type</p>
          <p className="font-semibold text-lg">{policyData.productType || "N/A"}</p>
        </div>
      </Card>
      <Card className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-green-100 p-3 mb-2">
            <Heart className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Death Benefit</p>
          <p className="font-semibold text-lg">{formatCurrency(policyData.deathBenefit)}</p>
        </div>
      </Card>
      <Card className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-purple-100 p-3 mb-2">
            <DollarSign className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Annual Premium</p>
          <p className="font-semibold text-lg">{formatCurrency(policyData.annualPremium)}</p>
        </div>
      </Card>
    </div>
  )
}

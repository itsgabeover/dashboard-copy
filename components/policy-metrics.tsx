import { Card } from "@/components/ui/card"
import { FileText, Heart, DollarSign } from "lucide-react"
import type { PolicyOverviewData } from "@/types/policy-dashboard"
interface PolicyMetricsProps {
  policyData: PolicyOverviewData
}

export function PolicyMetrics({ policyData }: PolicyMetricsProps) {
  // Extract values from bullets
  const getValueFromBullets = (targetTitle: string): number | null => {
    const bullet = policyData.bullets.find((b) => b.title.toLowerCase() === targetTitle.toLowerCase())
    if (!bullet) return null

    // Extract number from content (removes currency symbol and commas)
    const numberMatch = bullet.content.replace(/[$,]/g, "").match(/\d+/)
    return numberMatch ? Number.parseInt(numberMatch[0], 10) : null
  }

  // Get policy type from bullets or productType field
  const getPolicyType = (): string => {
    if (policyData.productType) return policyData.productType

    const designBullet = policyData.bullets.find((b) => b.title.toLowerCase() === "policy design")
    return designBullet?.content || "N/A"
  }

  // Get values with fallbacks
  const policyType = getPolicyType()
  const deathBenefit = policyData.deathBenefit || getValueFromBullets("death benefit")
  const premiumAmount = policyData.annualPremium || getValueFromBullets("premium amount")

  const formatCurrency = (value: number | null) => {
    if (value === null) return "N/A"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-blue-100 p-3 mb-2">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Policy Type</p>
          <p className="font-semibold text-lg">{policyType}</p>
        </div>
      </Card>

      <Card className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-green-100 p-3 mb-2">
            <Heart className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Death Benefit</p>
          <p className="font-semibold text-lg">{formatCurrency(deathBenefit)}</p>
        </div>
      </Card>

      <Card className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-purple-100 p-3 mb-2">
            <DollarSign className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Annual Premium</p>
          <p className="font-semibold text-lg">{formatCurrency(premiumAmount)}</p>
        </div>
      </Card>
    </div>
  )
}


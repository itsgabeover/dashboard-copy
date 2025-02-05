import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { PolicyOverview as PolicyOverviewType } from "@/types/policy"

export default function PolicyOverview({
  productName,
  carrierName,
  policyDesign,
  deathBenefit,
  premiumAmount,
  riders,
}: PolicyOverviewType) {
  return (
    <Card className="bg-white shadow-lg border-0 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-50 rounded-lg p-2">
            <CheckCircle className="w-6 h-6 text-[#4B6FEE]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Policy Overview</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-600">Product Name</h3>
            <p className="text-gray-900">{productName}</p>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-600">Issuer</h3>
            <p className="text-gray-900">{carrierName}</p>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-600">Product Type</h3>
            <p className="text-gray-900">{policyDesign}</p>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-600">Death Benefit</h3>
            <p className="text-gray-900">{formatCurrency(deathBenefit)}</p>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-600">Annual Premium</h3>
            <p className="text-gray-900">{formatCurrency(premiumAmount)}</p>
          </div>
          {riders && riders.length > 0 && (
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-600">Riders</h3>
              <ul className="text-gray-900 list-disc list-inside">
                {riders.map((rider, index) => (
                  <li key={index} className="text-sm">
                    {rider}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


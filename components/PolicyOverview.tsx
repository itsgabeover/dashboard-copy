import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PolicyOverview as PolicyOverviewType } from "@/types/policy"

interface PolicyOverviewProps {
  policyOverview: PolicyOverviewType
}

export default function PolicyOverview({ policyOverview }: PolicyOverviewProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Policy Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Product Name</p>
            <p className="text-lg font-semibold">{policyOverview.productName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Issuer</p>
            <p className="text-lg font-semibold">{policyOverview.issuer}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Product Type</p>
            <p className="text-lg font-semibold">{policyOverview.productType}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Death Benefit</p>
            <p className="text-lg font-semibold">${policyOverview.deathBenefit.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Annual Premium</p>
            <p className="text-lg font-semibold">${policyOverview.annualPremium.toLocaleString()}</p>
          </div>
          {policyOverview.policyStatus && (
            <div>
              <p className="text-sm font-medium text-gray-500">Policy Status</p>
              <p className="text-lg font-semibold">{policyOverview.policyStatus}</p>
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-500">Riders</p>
          <ul className="list-disc list-inside">
            {policyOverview.riders.map((rider, index) => (
              <li key={index} className="text-sm">
                {rider}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}


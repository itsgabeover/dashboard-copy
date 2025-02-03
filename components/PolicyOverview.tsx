import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PolicyOverviewProps {
  policyName: string
  insurer: string
  policyType: string
  deathBenefit: number
  premiumAmount: number
  policyStatus: string
}

export default function PolicyOverview({
  policyName,
  insurer,
  policyType,
  deathBenefit,
  premiumAmount,
  policyStatus,
}: PolicyOverviewProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Policy Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Policy Name</p>
            <p className="text-lg font-semibold">{policyName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Insurer</p>
            <p className="text-lg font-semibold">{insurer}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Policy Type</p>
            <p className="text-lg font-semibold">{policyType}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Death Benefit</p>
            <p className="text-lg font-semibold">${deathBenefit.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Premium Amount</p>
            <p className="text-lg font-semibold">${premiumAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Policy Status</p>
            <p className="text-lg font-semibold">{policyStatus}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


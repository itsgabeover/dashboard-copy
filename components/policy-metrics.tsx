import { Card } from "@/components/ui/card"
import { Heart, DollarSign, PiggyBank } from "lucide-react"

interface PolicyMetricsProps {
  policyDesign: string
  deathBenefit: string
  premium: string
  netCashValue: string
}

export function PolicyMetrics({ policyDesign, deathBenefit, premium, netCashValue }: PolicyMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-blue-100 p-3 mb-2">
            <Heart className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Policy Design</p>
          <p className="font-semibold text-lg">{policyDesign}</p>
        </div>
      </Card>

      <Card className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-green-100 p-3 mb-2">
            <Heart className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Death Benefit</p>
          <p className="font-semibold text-lg">{deathBenefit}</p>
        </div>
      </Card>

      <Card className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-purple-100 p-3 mb-2">
            <DollarSign className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Premium</p>
          <p className="font-semibold text-lg">{premium}</p>
        </div>
      </Card>

      <Card className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-orange-100 p-3 mb-2">
            <PiggyBank className="h-6 w-6 text-orange-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Net Cash Value</p>
          <p className="font-semibold text-lg">{netCashValue}</p>
        </div>
      </Card>
    </div>
  )
}


import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, EyeOff, AlertTriangle } from "lucide-react"
import type { PolicySection } from "@/types/policy"

interface InsightFrameworkProps {
  section: PolicySection
}

export default function InsightFramework({ section }: InsightFrameworkProps) {
  return (
    <Card className="bg-white shadow-lg border-0">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-50 rounded-lg p-2">
            <Sparkles className="w-6 h-6 text-[#4B6FEE]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Insight Framework</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-yellow-50">
                <Sparkles className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Hidden Gem</h3>
            </div>
            <div className="pl-9">
              <p className="text-gray-700 text-sm">{section.hiddengem}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50">
                <EyeOff className="w-5 h-5 text-[#4B6FEE]" />
              </div>
              <h3 className="font-semibold text-gray-900">Blind Spot</h3>
            </div>
            <div className="pl-9">
              <p className="text-gray-700 text-sm">{section.blindspot}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-red-50">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Red Flag</h3>
            </div>
            <div className="pl-9">
              <p className="text-gray-700 text-sm">{section.redflag}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}



import { Card, CardContent } from "@/components/ui/card"
import { LightbulbIcon } from "lucide-react"
import type { PolicySection } from "@/types/policy"

interface KeyTakeawaysProps {
  section: PolicySection
}

export default function KeyTakeaways({ section }: KeyTakeawaysProps) {
  return (
    <Card className="bg-white shadow-lg border-0">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-50 rounded-lg p-2">
            <LightbulbIcon className="w-6 h-6 text-[#4B6FEE]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Key Takeaways</h2>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-transparent border-l-4 border-[#4B6FEE] p-6 rounded-r-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Client Implications for {section.title}</h3>
            <p className="text-gray-700 leading-relaxed">{section.clientImplications}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Quote, FileText } from "lucide-react"
import type { PolicySection } from "@/types/policy"

interface SectionAnalysisProps {
  sections: PolicySection[]
  selectedSectionIndex: number
  onSectionChange: (index: number) => void
}

export default function SectionAnalysis({ sections, selectedSectionIndex, onSectionChange }: SectionAnalysisProps) {
  const selectedSection = sections[selectedSectionIndex]

  return (
    <Card className="bg-white shadow-lg border-0">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-50 rounded-lg p-2">
            <FileText className="w-6 h-6 text-[#4B6FEE]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Section Analysis</h2>
        </div>

        <div className="space-y-6">
          <div className="flex overflow-x-auto pb-2 hide-scrollbar">
            <div className="flex gap-2">
              {sections.map((section, index) => (
                <button
                  key={section.title}
                  onClick={() => onSectionChange(index)}
                  className={cn(
                    "px-4 py-2 whitespace-nowrap text-sm font-medium rounded-lg transition-colors",
                    selectedSectionIndex === index
                      ? "bg-[#4B6FEE] text-white"
                      : "text-gray-600 hover:bg-blue-50 hover:text-[#4B6FEE]",
                  )}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-blue-50/50 to-white rounded-lg border border-blue-100/50">
            <div className="prose max-w-none">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">{selectedSection.title}</h3>

              <div className="space-y-4">
                {selectedSection.quotes.map((quote, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <Quote className="w-5 h-5 text-[#4B6FEE] flex-shrink-0 mt-1" />
                    <p className="text-gray-700">{quote}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}



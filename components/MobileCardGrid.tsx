import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

interface MobileCardGridProps {
  items: Array<{ title: string; content: string }>
}

export function MobileCardGrid({ items }: MobileCardGridProps) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <div className="mt-1 flex-shrink-0">
                <div className="rounded-full bg-[rgb(82,102,255)]/10 p-2">
                  <ArrowRight className="h-4 w-4 text-[rgb(82,102,255)]" />
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-medium text-gray-900">{item.title.replace(":", "")}</h3>
                <p className="text-sm text-gray-600">{item.content}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


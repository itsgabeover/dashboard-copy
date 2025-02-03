"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function PortalContent() {
  const router = useRouter()
  
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Testing portal content</p>
        </CardContent>
      </Card>
    </div>
  )
}

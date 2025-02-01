"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

function SuccessContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="pt-6 text-center space-y-4">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h2 className="text-2xl font-semibold text-[#4361EE]">Upload Successful!</h2>
        <div className="space-y-2 text-gray-600">
          <p>
            Thank you for uploading your policy document. Your reports will be sent shortly to{" "}
            {email ? <span className="font-medium">{email}</span> : "the email address you provided"}.
          </p>
          <p>
            Need help? Contact our support team at{" "}
            <a href="mailto:support@financialplanner-ai.com" className="text-[#4361EE] hover:underline">
              support@financialplanner-ai.com
            </a>
          </p>
        </div>
      </CardContent>
      <CardFooter className="justify-center pb-6">
        <Link href="/">
          <Button variant="outline" className="border-[#4361EE] text-[#4361EE] hover:bg-[#4361EE] hover:text-white">
            Return to Home
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default function UploadSuccess() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4361EE]"></div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}


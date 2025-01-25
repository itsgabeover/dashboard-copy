"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface FormData {
  illustrationType: string
  minimumPremiumAge: string
  ownerInfo: {
    firstName: string
    lastName: string
    streetAddress: string
    city: string
    state: string
    zipCode: string
    phoneNumber: string
    emailAddress: string
  }
  policyInfo: {
    policyNumber: string
    insuranceCompanyName: string
  }
}

interface ReviewAndDownloadProps {
  formData: FormData
  prevStep: () => void
}

export default function ReviewAndDownload({ formData, prevStep }: ReviewAndDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = () => {
    setIsDownloading(true)
    // Simulating download process
    setTimeout(() => {
      setIsDownloading(false)
      // In a real application, you would generate and download the PDF here
      alert("Letter downloaded successfully!")
    }, 2000)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(date)
  }

  const getIllustrationType = () => {
    switch (formData.illustrationType) {
      case "current":
        return "Please provide an in-force illustration based on my current premium schedule, showing projected values and death benefits."
      case "minimum":
        return `Please provide an in-force illustration calculating the minimum premium required to keep this policy in-force to age ${formData.minimumPremiumAge}.`
      case "zero":
        return "Please provide an in-force illustration showing projected values with no further premium payments."
      case "reduced":
        return "Please provide an in-force illustration showing the reduced face amount that could be maintained with no further premium payments."
      case "maximum":
        return "Please provide an in-force illustration showing the maximum face amount that could be sustained using my current premium amount."
      default:
        return ""
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Review Your Request Letter</CardTitle>
        <CardDescription>
          Here&apos;s your completed in-force illustration request letter. Review it to make sure everything is correct.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p>{formatDate(new Date())}</p>
            <p className="mt-4">{formData.policyInfo.insuranceCompanyName}</p>
            <p>[Insurance Company Address]</p>
            <p>[City, State ZIP]</p>
            <p className="mt-4">RE: In-Force Illustration Request</p>
            <p>Policy Number: {formData.policyInfo.policyNumber}</p>
            <p className="mt-4">Dear Policy Services Representative:</p>
            <p className="mt-2">
              I am requesting an in-force illustration for the above-referenced life insurance policy. Please provide
              the following analysis:
            </p>
            <p className="mt-2">{getIllustrationType()}</p>
            <p className="mt-2">
              Please include both guaranteed and non-guaranteed projections based on current assumptions.
            </p>
            <p className="mt-4">Please send the illustration to:</p>
            <p>
              {formData.ownerInfo.firstName} {formData.ownerInfo.lastName}
            </p>
            <p>{formData.ownerInfo.streetAddress}</p>
            <p>
              {formData.ownerInfo.city}, {formData.ownerInfo.state} {formData.ownerInfo.zipCode}
            </p>
            {formData.ownerInfo.phoneNumber && <p>Phone: {formData.ownerInfo.phoneNumber}</p>}
            {formData.ownerInfo.emailAddress && <p>Email: {formData.ownerInfo.emailAddress}</p>}
            <p className="mt-4">
              I understand this illustration will be based on current policy values and assumptions that are not
              guaranteed.
            </p>
            <p className="mt-4">Sincerely,</p>
            <p className="mt-8">____________________</p>
            <p>
              {formData.ownerInfo.firstName} {formData.ownerInfo.lastName}
            </p>
            <p>Policy Owner</p>
            <p className="mt-4">Date: ____________________</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold mb-2">What Happens Next</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Print your letter</li>
              <li>Sign and date it</li>
              <li>Send it to your insurance company</li>
              <li>The company will process your request (response times vary)</li>
              <li>You&apos;ll receive a detailed projection of your policy&apos;s performance</li>
              <li>This service is provided at no cost</li>
            </ol>
          </div>
          <div className="flex justify-between">
            <Button onClick={prevStep} variant="outline">
              Edit Information
            </Button>
            <Button onClick={handleDownload} disabled={isDownloading}>
              {isDownloading ? "Downloading..." : "Download Letter"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


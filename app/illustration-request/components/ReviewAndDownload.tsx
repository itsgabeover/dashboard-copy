"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Printer, Send, CheckCircle, Loader2 } from "lucide-react"
import { jsPDF } from "jspdf"

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
  const [downloadComplete, setDownloadComplete] = useState(false)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
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

  const generatePDF = () => {
    const doc = new jsPDF()
    const lineHeight = 7
    let yPos = 20

    // Header
    doc.setFontSize(12)
    doc.text(formatDate(new Date()), 20, yPos)
    yPos += lineHeight * 2

    // Insurance Company Info
    doc.text(formData.policyInfo.insuranceCompanyName, 20, yPos)
    yPos += lineHeight
    doc.text("[Insurance Company Address]", 20, yPos)
    yPos += lineHeight
    doc.text("[City, State ZIP]", 20, yPos)
    yPos += lineHeight * 2

    // Subject Line
    doc.setFont(undefined, 'bold')
    doc.text("RE: In-Force Illustration Request", 20, yPos)
    doc.setFont(undefined, 'normal')
    yPos += lineHeight
    doc.text(`Policy Number: ${formData.policyInfo.policyNumber}`, 20, yPos)
    yPos += lineHeight * 2

    // Salutation
    doc.text("Dear Policy Services Representative:", 20, yPos)
    yPos += lineHeight * 2

    // Body
    const bodyText = "I am requesting an in-force illustration for the above-referenced life insurance policy. Please provide the following analysis:"
    const wrappedBody = doc.splitTextToSize(bodyText, 170)
    doc.text(wrappedBody, 20, yPos)
    yPos += wrappedBody.length * lineHeight + lineHeight

    const illustrationType = getIllustrationType()
    const wrappedType = doc.splitTextToSize(illustrationType, 170)
    doc.text(wrappedType, 20, yPos)
    yPos += wrappedType.length * lineHeight + lineHeight

    const projections = "Please include both guaranteed and non-guaranteed projections based on current assumptions."
    doc.text(projections, 20, yPos)
    yPos += lineHeight * 2

    // Mailing Address
    doc.text("Please send the illustration to:", 20, yPos)
    yPos += lineHeight
    doc.text(`${formData.ownerInfo.firstName} ${formData.ownerInfo.lastName}`, 20, yPos)
    yPos += lineHeight
    doc.text(formData.ownerInfo.streetAddress, 20, yPos)
    yPos += lineHeight
    doc.text(
      `${formData.ownerInfo.city}, ${formData.ownerInfo.state} ${formData.ownerInfo.zipCode}`,
      20,
      yPos
    )
    yPos += lineHeight

    if (formData.ownerInfo.phoneNumber) {
      doc.text(`Phone: ${formData.ownerInfo.phoneNumber}`, 20, yPos)
      yPos += lineHeight
    }
    if (formData.ownerInfo.emailAddress) {
      doc.text(`Email: ${formData.ownerInfo.emailAddress}`, 20, yPos)
      yPos += lineHeight
    }

    yPos += lineHeight

    // Disclaimer
    const disclaimer =
      "I understand this illustration will be based on current policy values and assumptions that are not guaranteed."
    const wrappedDisclaimer = doc.splitTextToSize(disclaimer, 170)
    doc.text(wrappedDisclaimer, 20, yPos)
    yPos += wrappedDisclaimer.length * lineHeight * 2

    // Signature
    doc.text("Sincerely,", 20, yPos)
    yPos += lineHeight * 3
    doc.text("____________________", 20, yPos)
    yPos += lineHeight
    doc.text(`${formData.ownerInfo.firstName} ${formData.ownerInfo.lastName}`, 20, yPos)
    yPos += lineHeight
    doc.text("Policy Owner", 20, yPos)
    yPos += lineHeight * 2
    doc.text("Date: ____________________", 20, yPos)

    return doc
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const doc = generatePDF()
      const fileName = `illustration_request_${formData.policyNumber}.pdf`
      doc.save(fileName)
      setDownloadComplete(true)
      setTimeout(() => setDownloadComplete(false), 3000)
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="space-y-6">
          <CardTitle className="text-3xl font-bold text-center text-[#4B6FEE]">
            Review Your Request Letter
          </CardTitle>
          <CardDescription className="text-lg text-center max-w-2xl mx-auto">
            Here&apos;s your completed in-force illustration request letter. Review it to make sure everything is correct.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Letter Preview */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm space-y-6">
              <div className="prose max-w-none">
                <p className="text-gray-600">{formatDate(new Date())}</p>
                <div className="mt-6">
                  <p className="font-medium">{formData.policyInfo.insuranceCompanyName}</p>
                  <p className="text-gray-600">[Insurance Company Address]</p>
                  <p className="text-gray-600">[City, State ZIP]</p>
                </div>
                <div className="mt-6">
                  <p className="font-medium">RE: In-Force Illustration Request</p>
                  <p className="text-gray-600">Policy Number: {formData.policyInfo.policyNumber}</p>
                </div>
                <div className="mt-6">
                  <p>Dear Policy Services Representative:</p>
                  <p className="mt-4">
                    I am requesting an in-force illustration for the above-referenced life insurance policy. 
                    Please provide the following analysis:
                  </p>
                  <p className="mt-4 pl-4 border-l-4 border-[#4B6FEE] bg-blue-50/30 p-4">
                    {getIllustrationType()}
                  </p>
                  <p className="mt-4">
                    Please include both guaranteed and non-guaranteed projections based on current assumptions.
                  </p>
                </div>
                <div className="mt-6">
                  <p className="font-medium">Please send the illustration to:</p>
                  <div className="mt-2 pl-4">
                    <p>
                      {formData.ownerInfo.firstName} {formData.ownerInfo.lastName}
                    </p>
                    <p>{formData.ownerInfo.streetAddress}</p>
                    <p>
                      {formData.ownerInfo.city}, {formData.ownerInfo.state} {formData.ownerInfo.zipCode}
                    </p>
                    {formData.ownerInfo.phoneNumber && <p>Phone: {formData.ownerInfo.phoneNumber}</p>}
                    {formData.ownerInfo.emailAddress && <p>Email: {formData.ownerInfo.emailAddress}</p>}
                  </div>
                </div>
                <p className="mt-6">
                  I understand this illustration will be based on current policy values and assumptions that 
                  are not guaranteed.
                </p>
                <div className="mt-6">
                  <p>Sincerely,</p>
                  <div className="mt-8">
                    <p className="border-b border-gray-400 w-48">
                      &nbsp;
                    </p>
                    <p>
                      {formData.ownerInfo.firstNameLet me continue from the exact cut off point:

```tsx
p>
                    <p>
                      {formData.ownerInfo.firstName} {formData.ownerInfo.lastName}
                    </p>
                    <p>Policy Owner</p>
                  </div>
                  <div className="mt-6">
                    <p className="border-b border-gray-400 w-48">Date: </p>
                  </div>
                </div>
              </div>
            </div>

            {/* What Happens Next Section */}
            <div className="bg-blue-50 p-8 rounded-lg border border-blue-200">
              <h3 className="text-xl font-semibold mb-4 text-[#4B6FEE] flex items-center gap-2">
                <CheckCircle className="h-6 w-6" />
                What Happens Next
              </h3>
              <ol className="space-y-3 list-none">
                {[
                  { icon: <Printer className="h-5 w-5" />, text: "Print your letter" },
                  { icon: <Send className="h-5 w-5" />, text: "Sign and date it" },
                  { icon: <Send className="h-5 w-5" />, text: "Send it to your insurance company" },
                  { icon: <Loader2 className="h-5 w-5" />, text: "The company will process your request (response times vary)" },
                  { icon: <CheckCircle className="h-5 w-5" />, text: "You'll receive a detailed projection of your policy's performance" },
                  { icon: <CheckCircle className="h-5 w-5" />, text: "This service is provided at no cost" },
                ].map((step, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      {step.icon}
                    </div>
                    <span className="text-gray-700">{step.text}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6">
              <Button
                onClick={prevStep}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Edit Information
              </Button>
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className={`bg-[#4B6FEE] hover:bg-blue-600 text-white px-8 py-6 rounded-full text-lg font-semibold 
                  transition-all duration-300 hover:transform hover:scale-105 flex items-center gap-2
                  ${downloadComplete ? 'bg-green-500 hover:bg-green-600' : ''}`}
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating PDF...
                  </>
                ) : downloadComplete ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Downloaded!
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    Download Letter
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}


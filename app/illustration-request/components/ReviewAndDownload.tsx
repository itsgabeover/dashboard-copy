"use client"

import React, { useState, useRef } from "react"
import { Button } from "../../../components/ui/button"
import { ArrowLeft, Download, CheckCircle, Loader2 } from "lucide-react"
import HomeButton from "./HomeButton"

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
    insuranceCompanyAddress?: string
    insuranceCompanyCity?: string
    insuranceCompanyState?: string
    insuranceCompanyZip?: string
  }
}

interface ReviewAndDownloadProps {
  formData: FormData
  prevStep: () => void
}

export default function ReviewAndDownload({ formData, prevStep }: ReviewAndDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)
  const letterRef = useRef<HTMLDivElement>(null)

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
        return "Please provide an in-force illustration showing the reduced coverage amount I can maintain without paying any additional premiums."
      case "maximum":
        return "Please provide an in-force illustration showing the maximum coverage amount possible while maintaining my current premium payments."
      default:
        return ""
    }
  }

  const handleDownload = async () => {
    if (!letterRef.current) return

    setIsDownloading(true)
    try {
      // Get the letter content
      const letterContent = letterRef.current.innerHTML

      // Create a new document with proper styling
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Illustration Request</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              line-height: 1.5;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            .letter-content {
              background: white;
              padding: 32px;
            }
            .space-y-6 > * + * {
              margin-top: 1.5rem;
            }
            .highlight {
              border-left: 4px solid #4B6FEE;
              background-color: rgba(75, 111, 238, 0.1);
              padding: 1rem;
              margin: 1rem 0;
            }
            .mt-4 { margin-top: 1rem; }
            .mt-8 { margin-top: 2rem; }
            .font-medium { font-weight: 500; }
            .text-gray-600 { color: #4B5563; }
            .pl-4 { padding-left: 1rem; }
          </style>
        </head>
        <body>
          <div class="letter-content space-y-6">
            ${letterContent}
          </div>
        </body>
        </html>
      `

      // Create a Blob with the HTML content
      const blob = new Blob([htmlContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)

      // Create a download link and trigger it
      const link = document.createElement("a")
      link.href = url
      link.download = `illustration-request-${formData.policyInfo.policyNumber}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setDownloadComplete(true)
      setTimeout(() => setDownloadComplete(false), 3000)
    } catch (error) {
      console.error("Error generating document:", error)
      alert("There was an error generating your document. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  const formatAddress = () => {
    if (!formData.policyInfo.insuranceCompanyAddress) return null

    const parts = []
    if (formData.policyInfo.insuranceCompanyAddress) {
      parts.push(formData.policyInfo.insuranceCompanyAddress)
    }

    const cityStateZip = []
    if (formData.policyInfo.insuranceCompanyCity) cityStateZip.push(formData.policyInfo.insuranceCompanyCity)
    if (formData.policyInfo.insuranceCompanyState) cityStateZip.push(formData.policyInfo.insuranceCompanyState)
    if (formData.policyInfo.insuranceCompanyZip) cityStateZip.push(formData.policyInfo.insuranceCompanyZip)

    if (cityStateZip.length > 0) {
      parts.push(cityStateZip.join(", "))
    }

    return parts
  }

  return (
    <div className="relative p-8">
      <HomeButton />
      <div className="max-w-2xl mx-auto space-y-8">
        <h2 className="text-2xl font-bold text-center text-[#4B6FEE]">Review Your Request Letter</h2>

        <p className="text-gray-600 text-center">
          Here&apos;s your completed in-force illustration request letter. Review it to make sure everything is correct.
        </p>

        <div ref={letterRef} className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm space-y-6">
          <p className="text-gray-600">{formatDate(new Date())}</p>

          <div>
            <p className="font-medium">{formData.policyInfo.insuranceCompanyName}</p>
            {formatAddress()?.map((line, index) => (
              <p key={index} className="text-gray-600">
                {line}
              </p>
            ))}
          </div>

          <div>
            <p className="font-medium">RE: In-Force Illustration Request</p>
            <p className="text-gray-600">Policy Number: {formData.policyInfo.policyNumber}</p>
          </div>

          <div>
            <p>Dear Policy Services Representative:</p>
            <p className="mt-4">
              I am requesting an in-force illustration for the above-referenced life insurance policy. Please provide
              the following analysis:
            </p>
            <p className="mt-4 pl-4 border-l-4 border-[#4B6FEE] bg-blue-50/30 p-4">{getIllustrationType()}</p>
            <p className="mt-4">
              Please include both guaranteed and non-guaranteed projections based on current assumptions.
            </p>
          </div>

          <div>
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

          <p>
            I understand this illustration will be based on current policy values and assumptions that are not
            guaranteed.
          </p>

          <div>
            <p>Sincerely,</p>
            <div className="mt-8">
              <p className="border-b border-gray-400 w-48">&nbsp;</p>
              <p>
                {formData.ownerInfo.firstName} {formData.ownerInfo.lastName}
              </p>
              <p>Policy Owner</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-6">
          <Button onClick={prevStep} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Edit Information
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`bg-[#4B6FEE] text-white px-8 py-2 rounded-full font-medium 
              hover:bg-blue-600 transition-colors flex items-center gap-2
              ${downloadComplete ? "bg-green-500 hover:bg-green-600" : ""}`}
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
    </div>
  )
}


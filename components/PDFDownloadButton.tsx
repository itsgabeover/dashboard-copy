"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Loader2 } from "lucide-react"

interface PDFDownloadButtonProps {
  sessionId: string
  email: string
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ sessionId, email }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    if (!sessionId || !email) {
      setError("Missing session ID or email")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Step 1: Request PDF generation
      console.log("Initiating PDF generation request:", { sessionId, email })

      const response = await fetch("https://financialplanner-ai.app.n8n.cloud/webhook/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id: sessionId, email }),
      })

      if (!response.ok) {
        throw new Error(`PDF generation request failed with status: ${response.status}`)
      }

      // Step 2: Parse the response
      const rawData = await response.text()
      console.log("Raw response:", rawData)

      let data
      try {
        data = JSON.parse(rawData)
        console.log("Parsed response data:", data)
      } catch {
        throw new Error(`Failed to parse response: ${rawData}`)
      }

      // Step 3: Extract signed URL
      const responseData = Array.isArray(data) ? data[0] : data
      console.log("Processing response data:", responseData)

      if (!responseData?.body?.signedURL) {
        console.error("Invalid response structure:", responseData)
        throw new Error("Response missing signed URL")
      }

      // Step 4: Construct and validate download URL
      const baseUrl = "https://bacddplyskvckljpmgbe.supabase.co/storage/v1"
      const fullUrl = `${baseUrl}${responseData.body.signedURL}`
      const encodedUrl = encodeURI(fullUrl)

      console.log("Attempting to download from URL:", encodedUrl)

      // Step 5: Validate URL accessibility
      const urlCheck = await fetch(encodedUrl, {
        method: "HEAD",
        mode: "cors",
        credentials: "omit",
      })

      if (!urlCheck.ok) {
        throw new Error(`Download URL validation failed: ${urlCheck.status}`)
      }

      // Step 6: Trigger download
      window.open(encodedUrl, "_blank")
    } catch (err) {
      console.error("PDF Download Error:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to generate PDF"
      setError(`${errorMessage}. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={handleDownload}
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            Download Insurance Planner AI Analysis
          </>
        )}
      </Button>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default PDFDownloadButton


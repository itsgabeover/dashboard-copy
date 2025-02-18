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

      // Step 2: Parse the initial response
      const initialData = await response.json()
      console.log("Initial response:", initialData)

      if (initialData?.message === "Workflow was started") {
        // Step 3: Poll for the actual PDF URL
        let attempts = 0
        const maxAttempts = 10
        const pollInterval = 2000 // 2 seconds

        while (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, pollInterval))

          const pollResponse = await fetch("https://financialplanner-ai.app.n8n.cloud/webhook/check-pdf-status", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ session_id: sessionId, email }),
          })

          if (!pollResponse.ok) {
            attempts++
            continue
          }

          const pollData = await pollResponse.json()
          console.log("Poll response:", pollData)

          if (pollData?.[0]?.body?.signedURL) {
            // Step 4: Construct and validate download URL
            const baseUrl = "https://bacddplyskvckljpmgbe.supabase.co/storage/v1"
            const fullUrl = `${baseUrl}${pollData[0].body.signedURL}`
            const encodedUrl = encodeURI(fullUrl)

            console.log("Found download URL:", encodedUrl)

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
            return
          }

          attempts++
        }

        throw new Error("Timeout waiting for PDF generation")
      } else if (initialData?.[0]?.body?.signedURL) {
        // Handle immediate response case
        const baseUrl = "https://bacddplyskvckljpmgbe.supabase.co/storage/v1"
        const fullUrl = `${baseUrl}${initialData[0].body.signedURL}`
        const encodedUrl = encodeURI(fullUrl)

        console.log("Immediate download URL:", encodedUrl)
        window.open(encodedUrl, "_blank")
      } else {
        throw new Error("Unexpected response format")
      }
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


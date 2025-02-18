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

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const attemptPdfDownload = async (): Promise<string> => {
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

    const data = await response.json()
    console.log("Response data:", data)

    // Check if we got the workflow started message
    if (data?.message === "Workflow was started") {
      throw new Error("retry") // Special error to trigger retry
    }

    // Check for the expected response format
    if (Array.isArray(data) && data[0]?.body?.signedURL) {
      return data[0].body.signedURL
    }

    throw new Error("Unexpected response format")
  }

  const handleDownload = async () => {
    if (!sessionId || !email) {
      setError("Missing session ID or email")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      let attempts = 0
      const maxAttempts = 5 // Maximum number of retry attempts
      const initialDelay = 2000 // Start with 2 second delay

      while (attempts < maxAttempts) {
        try {
          console.log(`Attempt ${attempts + 1} of ${maxAttempts}`)

          const signedURL = await attemptPdfDownload()

          // If we get here, we have a valid signed URL
          const baseUrl = "https://bacddplyskvckljpmgbe.supabase.co/storage/v1"
          const fullUrl = `${baseUrl}${signedURL}`
          const encodedUrl = encodeURI(fullUrl)

          console.log("Download URL:", encodedUrl)

          // Validate URL accessibility
          const urlCheck = await fetch(encodedUrl, {
            method: "HEAD",
            mode: "cors",
            credentials: "omit",
          })

          if (!urlCheck.ok) {
            throw new Error(`Download URL validation failed: ${urlCheck.status}`)
          }

          // Trigger download
          window.open(encodedUrl, "_blank")
          return // Success - exit the function
        } catch (err) {
          if (err instanceof Error && err.message === "retry" && attempts < maxAttempts - 1) {
            // Wait before retrying, with exponential backoff
            const waitTime = initialDelay * Math.pow(1.5, attempts)
            console.log(`Waiting ${waitTime}ms before retry...`)
            await delay(waitTime)
            attempts++
            continue
          }
          throw err // Re-throw if it's not a retry error or we're out of attempts
        }
      }

      throw new Error("PDF generation timed out. Please try again.")
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
            {`Generating PDF...`}
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


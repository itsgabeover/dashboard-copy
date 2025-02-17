"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PDFDownloadButtonProps {
  sessionId: string
  email: string
}

interface N8NResponse {
  body: {
    signedURL: string
  }
  headers: Record<string, string>
  statusCode: number
  statusMessage: string
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ sessionId, email }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    if (!sessionId || !email) {
      setError("Missing required session data")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log("Starting PDF generation request", { sessionId, email })
      
      const response = await fetch("https://financialplanner-ai.app.n8n.cloud/webhook/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          // Add CORS headers if needed
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          session_id: sessionId,
          email: email,
        }),
      })

      console.log("PDF generation response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)
        throw new Error(`Server error: ${response.status}`)
      }

      const data: N8NResponse = await response.json()
      console.log("PDF generation response:", data)

      if (!data.body?.signedURL) {
        throw new Error("No signed URL in response")
      }

      // Get base URL from response or use default
      const supabaseStorageUrl = "https://bacddplyskvckljpmgbe.supabase.co/storage/v1"
      
      // Ensure the signedURL starts with a forward slash
      const cleanSignedURL = data.body.signedURL.startsWith('/') 
        ? data.body.signedURL 
        : '/' + data.body.signedURL

      const fullUrl = `${supabaseStorageUrl}${cleanSignedURL}`
      
      console.log("Opening download URL:", fullUrl)

      // First check if URL is accessible
      try {
        const urlCheck = await fetch(fullUrl, { method: 'HEAD' })
        if (!urlCheck.ok) {
          throw new Error("Generated URL is not accessible")
        }
      } catch (urlError) {
        console.error("URL verification failed:", urlError)
        throw new Error("Could not verify download URL")
      }

      window.open(fullUrl, "_blank")
      
    } catch (err) {
      console.error("PDF generation error:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to generate PDF"
      setError(`${errorMessage}. Please try again or contact support.`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={handleDownload}
        disabled={isLoading}
        className="w-full bg-[rgb(82,102,255)] hover:bg-[rgb(82,102,255)]/90 text-white"
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
          <AlertDescription>
            {error}
            <br />
            <small className="text-xs mt-1 block">
              If this persists, try refreshing the page or contact support.
            </small>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default PDFDownloadButton

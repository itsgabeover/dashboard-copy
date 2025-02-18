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

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ sessionId, email }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    if (!sessionId || !email) {
      setError("Missing required data")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log("Starting PDF generation", { sessionId, email })
      
      const response = await fetch("https://financialplanner-ai.app.n8n.cloud/webhook/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          email: email,
        }),
      })

      if (!response.ok) {
        throw new Error(`PDF generation failed: ${response.status}`)
      }

      const data = await response.json()
      console.log("N8N Response:", data)

      // Handle array response from n8n
      const responseData = Array.isArray(data) ? data[0] : data
      
      if (!responseData?.body?.signedURL) {
        throw new Error("Invalid response from PDF service")
      }

      // Construct the full URL
      const baseUrl = "https://bacddplyskvckljpmgbe.supabase.co/storage/v1"
      const fullUrl = `${baseUrl}${responseData.body.signedURL}`
      
      console.log("Opening download URL:", fullUrl)
      window.open(fullUrl, "_blank")

    } catch (err) {
      console.error("Download error:", err)
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
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default PDFDownloadButton

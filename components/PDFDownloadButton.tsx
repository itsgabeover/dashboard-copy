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
      const response = await fetch("https://financialplanner-ai.app.n8n.cloud/webhook/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id: sessionId, email }),
      })

      if (!response.ok) {
        throw new Error(`PDF generation failed: ${response.status}`)
      }

      const data = await response.json()
      console.log("N8N Response:", JSON.stringify(data, null, 2))

      const responseData = Array.isArray(data) ? data[0] : data

      if (!responseData?.body?.signedURL) {
        throw new Error("Invalid response: Missing signed URL")
      }

      const baseUrl = "https://bacddplyskvckljpmgbe.supabase.co/storage/v1"
      const fullUrl = `${baseUrl}${responseData.body.signedURL}`
      const encodedUrl = encodeURI(fullUrl)

      console.log("Download URL:", encodedUrl)

      const urlCheck = await fetch(encodedUrl, { method: "HEAD", mode: "cors" })
      if (!urlCheck.ok) {
        throw new Error(`Invalid download URL: ${urlCheck.status}`)
      }

      window.open(encodedUrl, "_blank")
    } catch (err) {
      console.error("Download error:", err)
      setError(err instanceof Error ? err.message : "Failed to generate PDF")
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


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PDFDownloadButton({ sessionId, email }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleDownload = async () => {
    if (!sessionId || !email) {
      setError("Missing required session data")
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      // Log the request
      console.log("Starting PDF generation request", { sessionId, email })
      
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

      // Log the response status
      console.log("PDF generation response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      console.log("PDF generation response:", data)

      if (!data.downloadUrl) {
        throw new Error("No download URL in response")
      }

      // Log the URL we're about to open
      console.log("Opening download URL:", data.downloadUrl)
      window.open(data.downloadUrl, "_blank")
      
    } catch (err) {
      console.error("PDF generation error:", err)
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
            <small>If this persists, check the console for details.</small>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

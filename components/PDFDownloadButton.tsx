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
      setError("Missing required session data")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Step 1: Call n8n webhook to generate PDF
      console.log("Calling n8n webhook", { sessionId, email })
      
      const n8nResponse = await fetch("https://financialplanner-ai.app.n8n.cloud/webhook/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          email: email,
        }),
      })

      if (!n8nResponse.ok) {
        const errorText = await n8nResponse.text()
        console.error("N8N Error:", errorText)
        throw new Error(`PDF generation failed: ${n8nResponse.status}`)
      }

      // Step 2: Get the response data
      const responseData = await n8nResponse.json()
      console.log("N8N Response:", responseData)

      // Handle array response
      const data = Array.isArray(responseData) ? responseData[0] : responseData
      
      if (!data?.body?.signedURL) {
        console.error("Invalid response format:", data)
        throw new Error("Invalid response from PDF generation")
      }

      // Step 3: Open the signed URL
      const signedURL = data.body.signedURL
      const supabaseUrl = "https://bacddplyskvckljpmgbe.supabase.co/storage/v1"
      const fullUrl = `${supabaseUrl}${signedURL}`
      
      console.log("Opening URL:", fullUrl)
      window.open(fullUrl, "_blank")
      
    } catch (err) {
      console.error("Download error:", err)
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
              If this persists, please try refreshing the page or contact support.
            </small>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default PDFDownloadButton

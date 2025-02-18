"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"

interface PDFDownloadButtonProps {
  sessionId: string
  email: string
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ sessionId, email }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Function to handle PDF generation via n8n
  const generatePDF = async () => {
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
    return Array.isArray(data) ? data[0] : data
  }

  // Function to construct and validate Supabase URL
  const constructStorageUrl = (signedURL: string) => {
    const baseUrl = "https://bacddplyskvckljpmgbe.supabase.co/storage/v1"
    return `${baseUrl}${signedURL}`
  }

  const handleDownload = async () => {
    if (!sessionId || !email) {
      setError("Missing required session data")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Step 1: Check Supabase session
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error("Not authenticated")
      }

      // Step 2: Generate PDF via n8n
      console.log("Starting PDF generation", { sessionId, email })
      const n8nResponse = await generatePDF()

      // Step 3: Validate n8n response
      if (!n8nResponse?.body?.signedURL) {
        console.error("Invalid n8n response:", n8nResponse)
        throw new Error("Invalid response from PDF generation service")
      }

      // Step 4: Construct and open URL
      const downloadUrl = constructStorageUrl(n8nResponse.body.signedURL)
      console.log("Opening download URL:", downloadUrl)
      window.open(downloadUrl, "_blank")

    } catch (err) {
      console.error("Download error:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to generate PDF"
      setError(`${errorMessage}. Please try again or contact support.`)
    } finally {
      setIsLoading(false)
    }
  }

  // Verify auth on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setError("Please sign in to download documents")
      }
    })
  }, [])

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

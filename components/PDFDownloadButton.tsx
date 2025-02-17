"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase" // Make sure this is imported

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
      // Get Supabase session
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      if (authError) throw authError

      console.log("Starting PDF generation request", { sessionId, email })
      
      const response = await fetch("https://financialplanner-ai.app.n8n.cloud/webhook/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": session ? `Bearer ${session.access_token}` : '',
        },
        body: JSON.stringify({
          session_id: sessionId,
          email: email,
        }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const responseData = await response.json()
      console.log("N8N Response:", responseData)

      const data = Array.isArray(responseData) ? responseData[0] : responseData
      if (!data?.body?.signedURL) {
        throw new Error("No download URL received")
      }

      // Get the signed URL from the response
      const signedURL = data.body.signedURL
      
      // Construct the full URL using storage API endpoint
      const supabaseUrl = "https://bacddplyskvckljpmgbe.supabase.co"
      const fullUrl = `${supabaseUrl}/storage/v1${signedURL}`
      
      console.log("Opening download URL:", fullUrl)

      // Use anchor element for download
      const link = document.createElement('a')
      link.href = fullUrl
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
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
              If this persists, please try refreshing the page or contact support.
            </small>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default PDFDownloadButton

"use client"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from '@/lib/supabase'

interface PDFDownloadButtonProps {
  sessionId: string
  email: string
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ sessionId, email }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const handleDownload = async () => {
    if (!sessionId || !email) {
      setError("Missing required session data")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Step 1: Initiate n8n webhook
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

      if (!response.ok) {
        throw new Error(`Failed to initiate PDF generation: ${response.status}`)
      }

      // Step 2: Wait for n8n to process (20 seconds)
      console.log("Waiting for PDF generation to complete...")
      await delay(20000)

      // Step 3: Get the actual response data which should contain the signed URL
      const data = await response.json()
      console.log("Raw n8n response:", data)
      
      // Add more detailed error checking
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.error("Invalid response format:", data)
        throw new Error("Invalid response from server")
      }

      const firstResponse = data[0]
      console.log("First response object:", firstResponse)

      if (!firstResponse || !firstResponse.body || typeof firstResponse.body.signedURL !== 'string') {
        console.error("Missing or invalid signed URL in response:", firstResponse)
        throw new Error("Invalid response format from server")
      }

      const signedURL = firstResponse.body.signedURL
      console.log("Extracted signed URL:", signedURL)

      // Extract the file path from the signed URL
      const pathMatch = signedURL.match(/\/policy-pdfs\/(.+\.pdf)/)
      if (!pathMatch) {
        console.error("Could not extract file path from signed URL:", signedURL)
        throw new Error("Invalid file path in signed URL")
      }

      const filePath = pathMatch[1]
      console.log("Extracted file path:", filePath)

      // Use Supabase client to download
      const { data: fileData, error: downloadError } = await supabase
        .storage
        .from('policy-pdfs')
        .download(filePath)

      if (downloadError) {
        console.error("Download error:", downloadError)
        throw new Error(`Download failed: ${downloadError.message}`)
      }

      if (!fileData) {
        throw new Error("No file data received")
      }

      // Create and trigger download
      const url = window.URL.createObjectURL(fileData)
      const a = document.createElement('a')
      a.href = url
      a.download = `insurance_analysis_${sessionId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
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
            <small>If this persists, please try refreshing the page.</small>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default PDFDownloadButton

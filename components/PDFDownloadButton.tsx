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
  const [downloadProgress, setDownloadProgress] = useState<string>("")

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const attemptDownload = async (signedURL: string, maxAttempts = 3): Promise<Response> => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`Download attempt ${attempt} of ${maxAttempts}...`)
        console.log('Using signed URL:', signedURL)
        
        const response = await fetch(signedURL, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Content-Type': 'application/json'
          },
        })

        console.log(`Response status:`, response.status)
        if (response.ok) {
          return response
        }

        if (attempt < maxAttempts) {
          const waitTime = 3000
          console.log(`Waiting ${waitTime/1000} seconds before retry...`)
          await delay(waitTime)
        } else {
          throw new Error(`Download failed after ${maxAttempts} attempts`)
        }
      } catch (err) {
        console.error(`Attempt ${attempt} error:`, err)
        if (attempt === maxAttempts) {
          throw err
        }
      }
    }
    throw new Error("Download failed")
  }

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
        },
        body: JSON.stringify({
          session_id: sessionId,
          email: email,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      console.log("PDF generation response:", data)

      if (!data.signedURL) {
        throw new Error("No signed URL received from server")
      }
      console.log('Received signed URL:', data.signedURL)

      // Wait initial 3 seconds for n8n processing
      console.log("Waiting for initial n8n processing...")
      await delay(3000)

      const downloadResponse = await attemptDownload(data.signedURL)
      
      const blob = await downloadResponse.blob()
      const url = window.URL.createObjectURL(blob)
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
            {downloadProgress || "Generating PDF..."}
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

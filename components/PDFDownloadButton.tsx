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
     console.log("Response data:", data)

     if (!data[0]?.body?.signedURL) {
       throw new Error("No signed URL received")
     }

     const signedURL = data[0].body.signedURL
     console.log("Received signed URL:", signedURL)

     // Step 4: Construct the full URL with the base URL and signed URL
     const baseUrl = "https://bacddplyskvckljpmgbe.supabase.co"
     const fullURL = signedURL.startsWith('http') ? signedURL : `${baseUrl}${signedURL}`
     
     console.log("Full URL:", fullURL)

     // Step 5: Make the download request with the signed URL
     const downloadResponse = await fetch(fullURL, {
       headers: {
         'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
       }
     })

     if (!downloadResponse.ok) {
       throw new Error(`Download failed: ${downloadResponse.status}`)
     }

     // Step 6: Create and trigger download
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

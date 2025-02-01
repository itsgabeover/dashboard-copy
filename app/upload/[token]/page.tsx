"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Upload, ChevronLeft, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Link from "next/link"
import AnalysisProgress from "@/components/AnalysisProgress"

interface UploadStatus {
  state: "idle" | "uploading" | "success" | "error"
  message?: string
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const validTLDs = [".com", ".net", ".org", ".edu", ".gov", ".mil", ".info", ".io", ".co.uk", ".ca"]
  return (
    emailRegex.test(email) &&
    !email.endsWith(".con") &&
    !email.endsWith(".cim") &&
    !email.includes("..") &&
    email.length <= 254 &&
    validTLDs.some((tld) => email.toLowerCase().endsWith(tld))
  )
}

export default function UploadPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [email, setEmail] = useState("")
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ state: "idle" })
  const [step, setStep] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [analysisStatus, setAnalysisStatus] = useState<"idle" | "inProgress" | "complete">("idle")
  //const [policyId, setPolicyId] = useState<string | null>(null) //Removed as policyId is no longer needed

  useEffect(() => {
    const pathToken = window.location.pathname.split("/").pop()
    if (pathToken && pathToken.startsWith("pi_") && pathToken.includes("_")) {
      setIsLoading(false)
    } else {
      router.push("/")
    }
  }, [router])

  useEffect(() => {
    if (analysisStatus === "inProgress") {
      const checkAnalysisStatus = async () => {
        try {
          const response = await fetch(`/api/analysis-status?email=${encodeURIComponent(email)}`)
          if (response.ok) {
            const { status } = await response.json()
            if (status === "complete") {
              setAnalysisStatus("complete")
              router.push(`/dashboard?email=${encodeURIComponent(email)}`)
            } else {
              setTimeout(checkAnalysisStatus, 5000) // Check again after 5 seconds
            }
          } else {
            console.error("Failed to fetch analysis status")
          }
        } catch (error) {
          console.error("Error checking analysis status:", error)
        }
      }

      checkAnalysisStatus()
    }
  }, [analysisStatus, email, router])

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    handleFileSelection(droppedFile)
  }

  const handleFileSelection = (selectedFile: File) => {
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setUploadStatus({ state: "error", message: "Please select a PDF file." })
        return
      }
      if (selectedFile.size > 2 * 1024 * 1024) {
        setUploadStatus({ state: "error", message: "File size exceeds 2MB." })
        return
      }
      setFile(selectedFile)
      setUploadStatus({ state: "idle" })
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      handleFileSelection(selectedFile)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!file || !email) return
    if (!isValidEmail(email)) {
      setUploadStatus({ state: "error", message: "Please enter a valid email address." })
      return
    }

    setUploadStatus({ state: "uploading" })

    const formData = new FormData()
    formData.append("file", file)
    formData.append("email", email)

    const pathToken = window.location.pathname.split("/").pop()
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${pathToken}`,
        },
        body: formData,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      setUploadStatus({ state: "success" })
      setAnalysisStatus("inProgress")
    } catch (error: unknown) {
      console.error("Upload error:", error)
      if (error instanceof Error) {
        setUploadStatus({
          state: "error",
          message:
            error.name === "AbortError"
              ? "Upload timed out. Please try again."
              : "Upload failed. Please try again or contact support.",
        })
      }
    }
  }

  const handleChangeFile = () => {
    setFile(null)
    setStep(1)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B6FEE]" aria-label="Loading" />
      </div>
    )
  }

  if (analysisStatus === "inProgress") {
    return <AnalysisProgress />
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      <main className="flex-1 container max-w-2xl mx-auto px-4 py-12">
        <Link href="/" className="text-muted-foreground">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <Card className="w-full max-w-lg mt-8">
          <CardContent className="p-4">
            <h1 className="text-2xl font-bold">Upload Your Policy</h1>
            <p className="mt-2 text-muted-foreground">Upload your policy document for analysis.</p>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <label htmlFor="file" className="block text-sm font-medium">
                File
              </label>
              <div
                className={cn(
                  "mt-2 border border-dashed rounded-lg p-4 flex items-center justify-center cursor-pointer",
                  { "border-sky-500": isDragging },
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="flex items-center space-x-2">
                    <FileText className="h-6 w-6 text-sky-500" />
                    <span className="text-sky-500">{file.name}</span>
                  </div>
                ) : (
                  <label htmlFor="fileInput" className="flex items-center space-x-2">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                    <span className="text-muted-foreground">Drag and drop or click to select a file</span>
                  </label>
                )}
                <input type="file" id="fileInput" onChange={handleFileChange} className="hidden" accept=".pdf" />
              </div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="mt-2"
              />
              <Button type="submit" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </form>
            {uploadStatus.state === "error" && <p className="mt-4 text-red-500">{uploadStatus.message}</p>}
            {uploadStatus.state === "success" && <p className="mt-4 text-green-500">Upload successful!</p>}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}


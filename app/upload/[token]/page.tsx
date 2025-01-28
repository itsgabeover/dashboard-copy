"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Upload, ChevronLeft, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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

  useEffect(() => {
    const pathToken = window.location.pathname.split("/").pop()
    if (pathToken && pathToken.startsWith("pi_") && pathToken.includes("_")) {
      setIsLoading(false)
    } else {
      router.push("/")
    }
  }, [router])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
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

  const handleSubmit = async (event: React.FormEvent) => {
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
      router.push(`/upload/success?email=${encodeURIComponent(email)}`)
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      <main className="flex-1 container max-w-2xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#4B6FEE] to-[#3B4FDE]">
              Ready to Analyze Your Policy?
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Just 2 quick steps to get your Insurance Planner AI analysis package
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="flex items-center group">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105",
                  step === 1 ? "bg-[#4B6FEE]" : "bg-[#4B6FEE]",
                )}
              >
                {step > 1 ? "✓" : "1"}
              </div>
              <div className="ml-3 space-y-1">
                <span className="block font-semibold text-[#4B6FEE]">Upload PDF</span>
                <span className="block text-sm text-gray-500">In-force illustration</span>
              </div>
            </div>
            <div className="w-24 h-[3px] bg-gray-200">
              <div
                className="h-full bg-[#4B6FEE] transition-all duration-300"
                style={{ width: step === 1 ? "0%" : "100%" }}
              />
            </div>
            <div className="flex items-center group">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-105",
                  step === 2 ? "bg-[#4B6FEE] text-white" : "bg-gray-100 text-gray-400",
                )}
              >
                2
              </div>
              <div className="ml-3 space-y-1">
                <span className={cn("block font-semibold", step === 2 ? "text-[#4B6FEE]" : "text-gray-400")}>
                  Email Address
                </span>
                <span className="block text-sm text-gray-500">Get your analysis</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 ? (
                  <div className="space-y-6">
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={cn(
                        "relative border-2 border-dashed rounded-xl p-12 transition-all duration-200",
                        isDragging
                          ? "border-[#4B6FEE] bg-blue-50/50 scale-[1.02]"
                          : "border-gray-200 hover:border-[#4B6FEE]/50",
                      )}
                    >
                      <input
                        type="file"
                        id="file-upload"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                        accept=".pdf"
                      />
                      <div className="text-center space-y-4">
                        <div className="relative">
                          <Upload className="mx-auto h-16 w-16 text-[#4B6FEE] animate-pulse" />
                          <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-medium text-gray-700">Upload your in-force illustration</p>
                          <p className="text-sm text-gray-500">Drag and drop your PDF or click to browse</p>
                          <p className="text-xs text-gray-400">PDF files only • Maximum 2MB</p>
                        </div>
                      </div>
                    </div>

                    {file && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <FileText className="h-8 w-8 text-[#4B6FEE]" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-gray-500">PDF • {(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg text-sm text-gray-600">
                      <span className="text-[#4B6FEE]">ⓘ</span>
                      <span>We analyze in-force illustrations only</span>
                    </div>

                    <Button
                      type="button"
                      className="w-full bg-[#4B6FEE] hover:bg-[#3B4FDE] h-12 rounded-lg text-white font-medium shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-200 transition-all"
                      disabled={!file}
                      onClick={() => setStep(2)}
                    >
                      Continue
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {file && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <FileText className="h-8 w-8 text-[#4B6FEE]" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-gray-500">PDF • {(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleChangeFile}
                          className="ml-auto text-[#4B6FEE] hover:underline"
                        >
                          Change
                        </button>
                      </div>
                    )}
                    <div className="space-y-3">
                      <label className="block text-lg font-medium text-gray-700">Enter your email address</label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full h-12 text-lg border-gray-300 focus:border-[#4B6FEE] focus:ring-[#4B6FEE]"
                      />
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg text-sm text-gray-600">
                      <span className="text-[#4B6FEE] mt-0.5">ⓘ</span>
                      <p>
                        Your analysis will be sent to this email within minutes. Please check your spam folder if not
                        received.
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setStep(1)}
                        className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 px-8 h-12 rounded-lg text-white font-medium shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-200 transition-all"
                        disabled={!isValidEmail(email) || uploadStatus.state === "uploading"}
                      >
                        {uploadStatus.state === "uploading" ? (
                          <span className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            Processing...
                          </span>
                        ) : (
                          "Start Analysis"
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {uploadStatus.state === "error" && uploadStatus.message && (
                  <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                    <span className="text-sm font-medium">{uploadStatus.message}</span>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}


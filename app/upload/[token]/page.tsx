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
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 container max-w-2xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-[#4B6FEE]">Ready to Analyze Your Policy?</h1>
            <p className="text-lg text-gray-600"> Just 2 quick steps to get your Insurance Planner AI analysis package</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-white",
                  step === 1 ? "bg-[#4B6FEE]" : "bg-[#4B6FEE]",
                )}
              >
                {step > 1 ? "✓" : "1"}
              </div>
              <span className="ml-2 font-medium text-[#4B6FEE]">Upload</span>
            </div>
            <div className="w-24 h-[2px] bg-gray-200">
              <div
                className="h-full bg-[#4B6FEE] transition-all duration-300"
                style={{ width: step === 1 ? "0%" : "100%" }}
              />
            </div>
            <div className="flex items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  step === 2 ? "bg-[#4B6FEE] text-white" : "bg-gray-100 text-gray-400",
                )}
              >
                2
              </div>
              <span className={cn("ml-2 font-medium", step === 2 ? "text-[#4B6FEE]" : "text-gray-400")}>Confirm email</span>
            </div>
          </div>

          {/* Main Content */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 ? (
                  <div className="space-y-6">
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={cn(
                        "relative border-2 border-dashed rounded-xl p-12",
                        isDragging ? "border-[#4B6FEE] bg-blue-50/50" : "border-gray-200",
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
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="space-y-2">
                          <p className="text-gray-600">Drag and drop your PDF or click to browse</p>
                          <p className="text-sm text-gray-400">PDF files only, maximum 2MB</p>
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

                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <span className="text-gray-400">ⓘ</span>
                      We analyze in-force illustrations only
                    </div>

                    <Button
                      type="button"
                      className="w-full bg-[#4B6FEE] hover:bg-[#3B4FDE] h-12 rounded-lg text-white"
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
                    <div className="space-y-2">
                      <label className="text-gray-700 text-lg">Email Address</label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full h-12 text-lg"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <span className="text-gray-400">ⓘ</span>
                      Your analysis will be sent to this email within minutes. Please check your spam folder if not
                      received.
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Back
                      </button>
                      <Button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 px-8 h-12 rounded-lg text-white"
                        disabled={!isValidEmail(email) || uploadStatus.state === "uploading"}
                      >
                        {uploadStatus.state === "uploading" ? "Processing..." : "Start Analysis"}
                      </Button>
                    </div>
                  </div>
                )}

                {uploadStatus.state === "error" && uploadStatus.message && (
                  <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                    <span className="text-sm">{uploadStatus.message}</span>
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


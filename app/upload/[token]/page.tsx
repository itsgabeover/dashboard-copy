"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Upload, AlertTriangle, Info, ChevronRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

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

  useEffect(() => {
    const pathToken = window.location.pathname.split("/").pop()
    if (pathToken && pathToken.startsWith("pi_") && pathToken.includes("_")) {
      setIsLoading(false)
    } else {
      router.push("/")
    }
  }, [router])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
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
      setStep(2)
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
      router.push("/upload/success")
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B6FEE]" aria-label="Loading" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-blue-50/30">
      {/* Advisor Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 text-blue-700 py-2 px-4 text-center border-b border-blue-100/50">
        <Link
          href="/advisor-demo"
          className="text-base font-medium hover:underline inline-flex items-center gap-2 transition-colors hover:text-blue-800"
        >
          Financial Advisor? Schedule a Demo <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <main className="flex-1 container max-w-2xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-[#4B6FEE]">Upload Your In-Force Illustration</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI transforms your illustration into actionable insights through two detailed reports
            </p>
          </div>

          {/* Progress Steps */}
          <div className="relative">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4B6FEE] transition-all duration-300 rounded-full"
                style={{ width: step === 1 ? "50%" : "100%" }}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className={`text-sm font-medium ${step >= 1 ? "text-[#4B6FEE]" : "text-gray-400"}`}>
                1. Upload Illustration
              </div>
              <div className={`text-sm font-medium text-right ${step >= 2 ? "text-[#4B6FEE]" : "text-gray-400"}`}>
                2. Confirm Email
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                  <div className="space-y-4">
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-6 transition-all ${
                        file ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-[#4B6FEE]"
                      }`}
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
                          <p className="text-sm text-gray-500">
                            {file ? file.name : "Drag and drop your PDF or click to browse"}
                          </p>
                          <p className="text-xs text-gray-400">Maximum file size: 2MB</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 flex items-start gap-2">
                      <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p>We analyze in-force illustrations only. Please ensure all pages are included.</p>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (e.target.value && !isValidEmail(e.target.value)) {
                            setUploadStatus({
                              state: "error",
                              message: "Please enter a valid email address",
                            })
                          } else {
                            setUploadStatus({ state: "idle" })
                          }
                        }}
                        placeholder="your@email.com"
                        className={`w-full ${email && !isValidEmail(email) ? "border-red-500" : ""}`}
                      />
                    </div>
                    <div className="text-sm text-gray-500 flex items-start gap-2">
                      <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p>
                        Your analysis will be sent to this email within minutes. Check spam folders if not received.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  {step > 1 && (
                    <Button type="button" variant="ghost" onClick={() => setStep(step - 1)}>
                      Back
                    </Button>
                  )}
                  {step === 1 && file && (
                    <Button type="button" className="ml-auto" onClick={() => setStep(2)}>
                      Continue
                    </Button>
                  )}
                  {step === 2 && (
                    <Button
                      type="submit"
                      className="ml-auto bg-[#4B6FEE] hover:bg-[#3B4FDE]"
                      disabled={!isValidEmail(email) || uploadStatus.state === "uploading"}
                    >
                      {uploadStatus.state === "uploading" ? (
                        "Processing..."
                      ) : (
                        <>
                          Start Analysis
                          <Zap className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>

              {uploadStatus.state === "error" && uploadStatus.message && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">{uploadStatus.message}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}


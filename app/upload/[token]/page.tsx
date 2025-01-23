"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Upload, AlertTriangle, X, Info, ChevronRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"

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

const UploadPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [email, setEmail] = useState("")
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    // Get token from URL path
    const pathToken = window.location.pathname.split("/").pop()

    // Validate token format (starts with pi_ and contains underscore)
    if (pathToken && pathToken.startsWith("pi_") && pathToken.includes("_")) {
      setIsLoading(false)
    } else {
      // No valid token, redirect to home
      router.push("/")
    }
  }, [router])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setErrorMessage("Please select a PDF file.")
        return
      }
      if (selectedFile.size > 2 * 1024 * 1024) {
        setErrorMessage("File size exceeds 2MB.")
        return
      }
      setFile(selectedFile)
      setErrorMessage("")
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!file || !email) return
    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email address.")
      return
    }

    setUploadStatus("uploading")
    setErrorMessage("")

    const formData = new FormData()
    formData.append("file", file)
    formData.append("email", email)

    // Get token from current URL
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
      setUploadStatus("success")
      router.push("/upload/success")
    } catch (error: unknown) {
      console.error("Upload error:", error)
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          setErrorMessage("Upload timed out. Please try again.")
        } else {
          setErrorMessage("Upload failed. Please try again or contact support.")
        }
      } else {
        setErrorMessage("Upload failed. Please try again or contact support.")
      }
      setUploadStatus("error")
    }
  }

  const clearFileSelection = () => {
    setFile(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B6FEE]" aria-label="Loading" />
      </div>
    )
  }

  const isSubmitDisabled = uploadStatus === "uploading" || !file || !email || (email.length > 0 && !isValidEmail(email))

  return (
    <div className="flex flex-col min-h-screen">
      {/* Advisor Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 text-blue-700 py-2 px-4 text-center border-b border-blue-100/50">
        <Link
          href="/advisor-demo"
          className="text-base font-medium hover:underline inline-flex items-center gap-2 transition-colors hover:text-blue-800"
        >
          Financial Advisor? Schedule a Demo <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <section className="w-full bg-gradient-to-b from-gray-100 to-blue-100/50 flex-grow">
        <div className="container mx-auto px-4 pt-16 md:pt-24 lg:pt-32">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-[#4B6FEE] mb-4">
                Upload Your In-Force Illustration
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Our AI transforms your illustration into actionable insights through two detailed reports:
              </CardDescription>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Card className="bg-gray-50">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">Clear Email Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Policy Overview & Structure</li>
                      <li>Protection Features & Benefits</li>
                      <li>Built-in Policy Advantages</li>
                      <li>Critical Management Points</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-gray-50">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">Professional PDF Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Comprehensive Policy Analysis</li>
                      <li>Detailed Feature Assessment</li>
                      <li>Risk & Opportunity Insights</li>
                      <li>Advisor Discussion Topics</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                    Upload In-Force Illustration (PDF)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-[#4B6FEE] hover:text-[#3B4FDE] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#4B6FEE]"
                        >
                          <span>Upload a file</span>
                          <Input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                            accept=".pdf"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">Maximum file size: 2MB</p>
                    </div>
                  </div>
                  {file && (
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm text-gray-600">Selected file: {file.name}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearFileSelection}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Important Notes:</h4>
                    <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
                      <li>We analyze in-force illustrations only</li>
                      <li>Most recent illustration recommended</li>
                      <li>All illustration pages must be included</li>
                      <li>Results delivered within minutes</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (e.target.value && !isValidEmail(e.target.value)) {
                        setErrorMessage("Please enter a valid email address")
                      } else {
                        setErrorMessage("")
                      }
                    }}
                    placeholder="your@email.com"
                    required
                    className={`w-full ${email && !isValidEmail(email) ? "border-red-500" : ""}`}
                  />
                  <div className="mt-2 flex items-start space-x-2 text-sm text-gray-600">
                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p>
                      Please double-check your email address carefully. Your analysis will be sent to this email. If you
                      don&apos;t receive it within 30 minutes, please check your spam/junk folders. Still can&apos;t
                      find it? Contact us at{" "}
                      <a href="mailto:support@financialplanner-ai.com" className="text-[#4B6FEE] hover:text-[#3B4FDE]">
                        support@financialplanner-ai.com
                      </a>
                    </p>
                  </div>
                  {email && !isValidEmail(email) && (
                    <p className="mt-1 text-sm text-red-500">Please enter a valid email address</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#4B6FEE] hover:bg-[#3B4FDE] text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  disabled={isSubmitDisabled}
                >
                  {uploadStatus === "uploading" ? (
                    "Uploading..."
                  ) : (
                    <>
                      Start Analysis
                      <Zap className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              {errorMessage && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md flex items-center">
                  <AlertTriangle className="mr-2" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default UploadPage


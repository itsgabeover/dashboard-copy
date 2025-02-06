"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { v4 as uuidv4 } from "uuid"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface UploadInterfaceProps {
  token: string
}

interface UploadResponse {
  success: boolean
  message?: string
  error?: string
}

export function UploadInterface({ token }: UploadInterfaceProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [sessionId, setSessionId] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    console.log("UploadInterface mounted with token:", token)
    console.log("Is mock token:", token.includes("_mock"))
    setSessionId(uuidv4())
  }, [token])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Please select a PDF file.")
        setFile(null)
      } else if (selectedFile.size > 2 * 1024 * 1024) {
        setError("File size exceeds 2 MB limit. Please select a smaller file.")
        setFile(null)
      } else {
        setFile(selectedFile)
        setError(null)
      }
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile) {
      if (droppedFile.type !== "application/pdf") {
        setError("Please select a PDF file.")
      } else if (droppedFile.size > 2 * 1024 * 1024) {
        setError("File size exceeds 2 MB limit. Please select a smaller file.")
      } else {
        setFile(droppedFile)
        setError(null)
      }
    }
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleUpload = async () => {
    if (!file || !email) {
      setError("Please provide both file and email")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // First, create a record in Supabase
      const { error: supabaseError } = await supabase.from("policies").insert([
        {
          session_id: sessionId,
          email: email.trim(),
          policy_name: file.name,
          status: "uploading",
          analysis_data: {},
        },
      ])

      if (supabaseError) {
        throw new Error(`Supabase error: ${supabaseError.message}`)
      }

      // Create FormData
      const formData = new FormData()

      // Log file details before upload
      console.log("File details:", {
        name: file.name,
        type: file.type,
        size: file.size,
      })

      // Append file and other data directly (no metadata object)
      formData.append("data0", file)
      formData.append("email", email.trim())
      formData.append("filename", file.name)
      formData.append("timestamp", new Date().toISOString())
      formData.append("token", token)
      formData.append("sessionId", sessionId)

      // Log FormData entries for debugging
      for (const [key, value] of formData.entries()) {
        console.log(`FormData entry - ${key}:`, value instanceof File ? value.name : value)
      }

      // Make the upload request
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const responseText = await response.text()
      console.log("API response:", responseText)

      let data: UploadResponse
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error("Failed to parse response:", responseText)
        throw new Error("Invalid response from server")
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || "Upload failed")
      }

      // Success path
      localStorage.setItem("currentSessionId", sessionId)
      localStorage.setItem("userEmail", email.trim())

      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      router.push("/processing")
    } catch (error) {
      console.error("Upload failed:", error)
      setError(error instanceof Error ? error.message : "An error occurred during upload. Please try again.")

      // Clean up failed upload from Supabase
      await supabase.from("policies").delete().match({ session_id: sessionId })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-[#4361EE]">Upload In-Force Illustration</CardTitle>
            <CardDescription className="text-gray-600 space-y-2">
              <p>
                Please upload your life insurance policy&apos;s in-force illustration for analysis. Our AI will review
                your policy and provide detailed insights within minutes.
              </p>
              <p>You&apos;ll receive:</p>
              <ul className="list-disc list-inside">
                <li>A clear email summary of your coverage</li>
                <li>Professional PDF analysis with detailed metrics</li>
                <li>Optimization recommendations</li>
              </ul>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div
              className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer hover:border-[#4361EE] transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto mb-3 text-[#4361EE]" size={32} />
              <p className="mb-1 text-gray-600">Drag and drop your file here or click to browse</p>
              <p className="text-sm text-gray-500">Supported format: PDF (Max 2 MB)</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,application/pdf"
                className="hidden"
              />
            </div>

            {file && <p className="text-sm text-green-600">Selected file: {file.name}</p>}

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div>
              <label htmlFor="email" className="block mb-2 font-medium text-[#4361EE]">
                Email for Report Delivery
              </label>
              <Input
                type="email"
                id="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-gray-300 focus:border-[#4361EE] focus:ring-[#4361EE]"
              />
            </div>

            <Button
              className="w-full bg-[#4361EE] text-white hover:bg-[#3651DE] transition-colors"
              size="lg"
              onClick={handleUpload}
              disabled={!file || !email || isUploading}
            >
              {isUploading ? "Uploading..." : "Submit for Analysis"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}


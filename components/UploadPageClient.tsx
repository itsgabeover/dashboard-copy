"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type React from "react" // Added import for React

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

export default function UploadPageClient({ token }: { token: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [email, setEmail] = useState("")
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ state: "idle" })
  const [step, setStep] = useState(1)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (token && token.startsWith("pi_") && token.includes("_")) {
      setIsLoading(false)
    } else {
      router.push("/")
    }
  }, [router, token])

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile)
      setStep(2)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
      setStep(2)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file || !isValidEmail(email)) {
      setUploadStatus({ state: "error", message: "Please provide a valid PDF file and email address." })
      return
    }

    setUploadStatus({ state: "uploading" })

    // Implement your file upload logic here
    // For example:
    // const formData = new FormData()
    // formData.append("file", file)
    // formData.append("email", email)
    // formData.append("token", token)
    //
    // try {
    //   const response = await fetch("/api/upload", {
    //     method: "POST",
    //     body: formData,
    //   })
    //   if (response.ok) {
    //     setUploadStatus({ state: "success", message: "File uploaded successfully!" })
    //     router.push("/processing")
    //   } else {
    //     throw new Error("Upload failed")
    //   }
    // } catch (error) {
    //   setUploadStatus({ state: "error", message: "Failed to upload file. Please try again." })
    // }

    // For now, we'll just simulate a successful upload
    setTimeout(() => {
      setUploadStatus({ state: "success", message: "File uploaded successfully!" })
      router.push("/processing")
    }, 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B6FEE]" aria-label="Loading" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Upload Your Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-4 text-center ${
                  isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
              >
                <p>Drag and drop your PDF file here, or click to select</p>
                <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="mt-2 inline-block cursor-pointer text-blue-500">
                  Select File
                </label>
              </div>
            )}
            {step === 2 && (
              <>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full" disabled={uploadStatus.state === "uploading"}>
                  {uploadStatus.state === "uploading" ? "Uploading..." : "Upload"}
                </Button>
              </>
            )}
          </form>
          {uploadStatus.state !== "idle" && (
            <p className={`mt-4 text-center ${uploadStatus.state === "error" ? "text-red-500" : "text-green-500"}`}>
              {uploadStatus.message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


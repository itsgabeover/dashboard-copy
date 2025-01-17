'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Upload, AlertTriangle, X, Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { UploadSuccess } from '@/components/upload-success'
import type { Metadata } from 'next'

// Define types to ensure type safety
type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

interface UploadPageProps {
  params: {
    token: string
  }
}

// Email validation function
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const validTLDs = ['.com', '.net', '.org', '.edu', '.gov', '.mil', '.info', '.io', '.co.uk', '.ca']
  return emailRegex.test(email) && 
         !email.endsWith('.con') && 
         !email.endsWith('.cim') && 
         !email.includes('..') && 
         email.length <= 254 && 
         validTLDs.some(tld => email.toLowerCase().endsWith(tld))
}

// Main component
export default function UploadPage({ params }: UploadPageProps) {
  const router = useRouter()
  const { token } = params

  // State management
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [file, setFile] = useState<File | null>(null)
  const [email, setEmail] = useState<string>('')
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  // Handle token storage
  useEffect(() => {
    if (!token) {
      router.push('/')
      return
    }

    try {
      sessionStorage.setItem('upload_token', token)
      setIsLoading(false)
    } catch (error) {
      console.error('Session storage error:', error)
      router.push('/')
    }
  }, [token, router])

  // File handling functions
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    if (selectedFile.type !== 'application/pdf') {
      setErrorMessage("Please select a PDF file.")
      setFile(null)
      return
    }
    
    if (selectedFile.size > 2 * 1024 * 1024) {
      setErrorMessage("File size exceeds 2MB.")
      setFile(null)
      return
    }
    
    setFile(selectedFile)
    setErrorMessage('')
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files[0]
    if (!droppedFile) return

    if (droppedFile.type !== 'application/pdf') {
      setErrorMessage("Please select a PDF file.")
      return
    }
    
    if (droppedFile.size > 2 * 1024 * 1024) {
      setErrorMessage("File size exceeds 2MB.")
      return
    }
    
    setFile(droppedFile)
    setErrorMessage('')
  }

  // Form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!file || !email) return
    
    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email address.")
      return
    }

    setUploadStatus('uploading')
    setErrorMessage('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('email', email)
    
    const storedToken = sessionStorage.getItem('upload_token')
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        },
        body: formData,
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }
      
      setUploadStatus('success')
    } catch (error: unknown) {
      console.error('Upload error:', error)
      setErrorMessage(
        error instanceof Error && error.name === 'AbortError'
          ? 'Upload timed out. Please try again.'
          : 'Upload failed. Please try again or contact support at support@financialplanner-ai.com.'
      )
      setUploadStatus('error')
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B6FEE]" aria-label="Loading" />
      </div>
    )
  }

  // Success state
  if (uploadStatus === 'success') {
    return <UploadSuccess />
  }

  // Main render
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-[#4361EE]">
              Upload In-Force Illustration
            </CardTitle>
            <CardDescription className="text-gray-600 space-y-2">
              <p>
                Please upload your life insurance policy&apos;s in-force illustration for analysis. 
                Our AI will review your policy and provide detailed insights within minutes.
              </p>
              <p>
                You&apos;ll receive:
              </p>
              <ul className="list-disc list-inside">
                <li>A clear email summary of your coverage</li>
                <li>Professional PDF analysis with detailed metrics</li>
              </ul>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div 
              className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer hover:border-[#4361EE] transition-colors"
              onClick={() => document.getElementById('file-upload')?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto mb-3 text-[#4361EE]" size={32} />
              <p className="mb-1 text-gray-600">Drag and drop your file here or click to browse</p>
              <p className="text-sm text-gray-500">Supported format: PDF (Max 2 MB)</p>
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
              />
            </div>
            
            {file && (
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm text-green-600">Selected file: {file.name}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFile(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

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
              <div className="mt-2 flex items-start space-x-2 text-sm text-gray-600">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>
                  Please double-check your email address carefully. Your analysis will be sent to this email.
                  If you don&apos;t receive it within 30 minutes, please check your spam/junk folders.
                  Still can&apos;t find it? Contact us at{' '}
                  <a href="mailto:support@fpai.com" className="text-[#4361EE] hover:text-[#3B4FDE]">
                    support@fpai.com
                  </a>
                </p>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full bg-[#4361EE] text-white hover:bg-[#3651DE]"
              size="lg"
              disabled={!file || !email || uploadStatus === 'uploading'}
            >
              {uploadStatus === 'uploading' ? 'Uploading...' : 'Submit for Analysis'}
            </Button>

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
  )
}

'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Upload, CheckCircle, AlertTriangle, X, Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type PageProps = {
  params: { token: string }
}

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

export default function UploadPage({ params }: PageProps) {
  const router = useRouter()
  const { token } = params
  const [isLoading, setIsLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [email, setEmail] = useState('')
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (token) {
      sessionStorage.setItem('upload_token', token)
      setIsLoading(false)
    } else {
      router.push('/')
    }
  }, [token, router])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setErrorMessage("Please select a PDF file.")
        return
      }
      if (selectedFile.size > 2 * 1024 * 1024) {
        setErrorMessage("File size exceeds 2MB.")
        return
      }
      setFile(selectedFile)
      setErrorMessage('')
    }
  }

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
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setErrorMessage('Upload timed out. Please try again.')
        } else {
          setErrorMessage('Upload failed. Please try again or contact support.')
        }
      } else {
        setErrorMessage('Upload failed. Please try again or contact support.')
      }
      setUploadStatus('error')
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

  const isSubmitDisabled = uploadStatus === 'uploading' || !file || !email || (email.length > 0 && !isValidEmail(email))

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0] py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-[#4B6FEE] mb-6">Upload Your Policy</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                Policy File (PDF)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#4B6FEE] hover:text-[#3B4FDE] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#4B6FEE]">
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
                  <p className="text-xs text-gray-500">PDF up to 2MB</p>
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
                    setErrorMessage('')
                  }
                }}
                placeholder="your@email.com"
                required
                className={`w-full ${email && !isValidEmail(email) ? 'border-red-500' : ''}`}
              />
              <div className="mt-2 flex items-start space-x-2 text-sm text-gray-600">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>
                  Please double-check your email address carefully. Your analysis will be sent to this email.
                  If you don&apos;t receive it within 30 minutes, please check your spam/junk folders.
                  Still can&apos;t find it? Contact us at{' '}
                  <a href="mailto:support@fpai.com" className="text-[#4B6FEE] hover:text-[#3B4FDE]">
                    support@fpai.com
                  </a>
                </p>
              </div>
              {email && !isValidEmail(email) && (
                <p className="mt-1 text-sm text-red-500">
                  Please enter a valid email address
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#4B6FEE] hover:bg-[#3B4FDE]"
              disabled={isSubmitDisabled}
            >
              {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload Policy'}
            </Button>
          </form>

          {errorMessage && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md flex items-center">
              <AlertTriangle className="mr-2" />
              <span>{errorMessage}</span>
            </div>
          )}

          {uploadStatus === 'success' && (
            <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md flex items-center">
              <CheckCircle className="mr-2" />
              <span>Upload successful! Your analysis will be emailed to you shortly. Please check your spam/junk folders if you don&apos;t see it within 30 minutes.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

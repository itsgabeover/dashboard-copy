'use client'

import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'

interface UploadMetadata {
  token: string
  filename: string
  timestamp: string
  email: string
}

interface UploadResponse {
  success: boolean
  message?: string
}

// Update Props to use specific type for token parameter
interface PageProps {
  params: {
    token: string
  }
}

export default function UploadPage({ params }: PageProps) {
  const [status, setStatus] = useState<'loading' | 'valid' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch('/api/validate-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: params.token })
        })

        const data = await response.json() as UploadResponse
        
        if (!data.success) {
          setStatus('error')
          setErrorMessage(data.message || 'Invalid token')
          return
        }

        setStatus('valid')
      } catch {
        setStatus('error')
        setErrorMessage('Failed to validate token')
      }
    }

    validateToken()
  }, [params.token])

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!email.trim()) {
      setErrorMessage('Please enter your email address')
      return
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setErrorMessage('Please enter a valid email address')
      return
    }

    if (file.type !== 'application/pdf') {
      setErrorMessage('Please select a PDF file')
      return
    }

    const TWO_MB = 2 * 1024 * 1024 // 2MB in bytes
    if (file.size > TWO_MB) {
      setErrorMessage('File size exceeds 2MB limit')
      return
    }

    setIsUploading(true)
    setErrorMessage('')

    try {
      const metadata: UploadMetadata = {
        token: params.token,
        filename: file.name,
        timestamp: new Date().toISOString(),
        email: email.trim()
      }

      const formData = new FormData()
      formData.append('data0', file)
      formData.append('metadata', JSON.stringify(metadata))

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${params.token}`
        },
        body: formData
      })

      const data = await response.json() as UploadResponse

      if (!data.success) {
        throw new Error(data.message || 'Upload failed')
      }

      setUploadSuccess(true)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to upload file')
    } finally {
      setIsUploading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Validating your upload session...</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">
            Upload Error
          </h1>
          <p className="text-gray-600 mb-4">
            {errorMessage}
          </p>
        </div>
      </div>
    )
  }

  if (uploadSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-green-600 mb-4">
            Upload Successful!
          </h1>
          <p className="text-gray-600 mb-4">
            Your document has been uploaded and will be processed shortly.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Upload Your Policy Illustration</h1>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700">Email Address</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </label>

            <label className="block">
              <span className="text-gray-700">PDF Document</span>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </label>

            {isUploading && (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                <span className="ml-2 text-gray-600">Uploading...</span>
              </div>
            )}

            {errorMessage && (
              <div className="text-red-600 text-sm">
                {errorMessage}
              </div>
            )}

            <div className="text-sm text-gray-500">
              <p>Please note:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Only PDF files are accepted</li>
                <li>Maximum file size: 2MB</li>
                <li>Upload link is valid for one use only</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { use } from 'react'
import { Upload, CheckCircle, AlertTriangle, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Document, Page as PDFPage, pdfjs } from 'react-pdf'

// Set worker using CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function UploadPage({ 
  params 
}: { 
  params: Promise<{ token: string }> 
}) {
  const router = useRouter()
  const { token } = use(params)
  const [isLoading, setIsLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [email, setEmail] = useState('')
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  useEffect(() => {
    if (token) {
      sessionStorage.setItem('upload_token', token)
      setIsLoading(false)
    } else {
      router.push('/')
    }
  }, [token, router])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setErrorMessage('Please select a PDF file.')
        return
      }
      if (selectedFile.size > 2 * 1024 * 1024) {
        setErrorMessage('File size exceeds 2MB.')
        return
      }
      setFile(selectedFile)
      setErrorMessage('')

      try {
        const fileUrl = URL.createObjectURL(selectedFile)
        setPreviewUrl(fileUrl)
      } catch (error) {
        setErrorMessage('Error creating preview')
        console.error('Preview error:', error)
      }
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!file || !email) return

    setUploadStatus('uploading')
    setErrorMessage('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('email', email)
    const storedToken = sessionStorage.getItem('upload_token')
    if (storedToken) {
      formData.append('token', storedToken)
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
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
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div 
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B6FEE]" 
          aria-label="Loading"
        />
      </div>
    )
  }

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
            {previewUrl && (
              <div className="mt-4 border rounded-md overflow-hidden">
                <Document
                  file={previewUrl}
                  className="w-full"
                  loading={<div className="p-4">Loading PDF...</div>}
                  error={<div className="text-red-500 p-4">Failed to load PDF. Please ensure you&apos;ve selected a valid PDF file.</div>}
                  onLoadError={(error) => {
                    console.error('PDF load error:', error)
                    setErrorMessage('Error loading PDF preview')
                  }}
                >
                  <PDFPage pageNumber={1} width={300} />
                </Document>
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#4B6FEE] hover:bg-[#3B4FDE]"
              disabled={uploadStatus === 'uploading' || !file || !email}
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
              <span>Upload successful! We&apos;ll email your analysis shortly.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

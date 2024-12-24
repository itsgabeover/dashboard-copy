'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, CheckCircle } from 'lucide-react'

interface UploadInterfaceProps {
  token: string
}

interface UploadResponse {
    success: boolean;
    message?: string;
    error?: string;
}

export function UploadInterface({ token }: UploadInterfaceProps) {
  const [email, setEmail] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file.')
        setFile(null)
      } else if (selectedFile.size > 2 * 1024 * 1024) {
        setError('File size exceeds 2 MB limit. Please select a smaller file.')
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
      if (droppedFile.type !== 'application/pdf') {
        setError('Please select a PDF file.')
      } else if (droppedFile.size > 2 * 1024 * 1024) {
        setError('File size exceeds 2 MB limit. Please select a smaller file.')
      } else {
        setFile(droppedFile)
        setError(null)
      }
    }
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleUpload = async () => {
    if (!file || !email) return;
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('data0', file);
      formData.append('metadata', JSON.stringify({
        email: email.trim(),
        token: token
      }));

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      // Get response text first for debugging
      const responseText = await response.text();
      console.log('n8n response:', responseText);

      // Try to parse as JSON if possible
      let data: UploadResponse;
      try {
        data = JSON.parse(responseText);
      } catch {
        console.log('Response is not JSON:', responseText);
        data = { success: response.ok, message: responseText };
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Upload failed');
      }

      setUploadSuccess(true);
      setFile(null);
      setEmail('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (err) {
      console.error('Upload failed:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'An error occurred during upload. Please try again.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <h3 className="text-2xl font-semibold mb-6 text-[#4361EE]">Upload In-Force Illustration</h3>
        
        <div className="space-y-6">
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
              accept=".pdf"
              className="hidden"
            />
          </div>
          
          {file && (
            <p className="text-sm text-green-600">Selected file: {file.name}</p>
          )}

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          
          <div>
            <label htmlFor="email" className="block mb-2 font-medium text-[#4361EE]">Email for Report Delivery</label>
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
            {isUploading ? 'Uploading...' : 'Submit for Analysis'}
          </Button>

          {uploadSuccess && (
            <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md flex items-center">
              <CheckCircle className="mr-2" />
              <span>Thank you for uploading your policy document. Your reports will be sent shortly to the email address you provided.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
// app/api/upload/route.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('data0') as File | null
    const metadataStr = formData.get('metadata') as string | null

    if (!file || !metadataStr) {
      return NextResponse.json(
        { 
          success: false, 
          error: !file ? 'No file provided' : 'No metadata provided' 
        },
        { status: 400 }
      )
    }

    let metadata
    try {
      metadata = JSON.parse(metadataStr)
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid metadata format' },
        { status: 400 }
      )
    }

    const n8nFormData = new FormData()
    n8nFormData.append('data0', file, file.name)
    n8nFormData.append('email', metadata.email)
    n8nFormData.append('filename', file.name)
    n8nFormData.append('timestamp', new Date().toISOString())

    const response = await fetch(process.env.NEXT_PUBLIC_UPLOAD_ENDPOINT!, {
      method: 'POST',
      body: n8nFormData
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('n8n error response:', errorText)
      throw new Error('Failed to process file with n8n')
    }

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully'
    })

  } catch (error) {
    console.error('Upload processing error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process upload'
      },
      { status: 500 }
    )
  }
}
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    // Validate authorization token
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get form data
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const email = formData.get('email') as string | null

    // Validate required fields
    if (!file || !email) {
      return NextResponse.json(
        { 
          success: false, 
          error: !file ? 'No file provided' : 'No email provided' 
        },
        { status: 400 }
      )
    }

    // Prepare data for n8n
    const n8nFormData = new FormData()
    n8nFormData.append('data0', file, file.name)
    n8nFormData.append('email', email)
    n8nFormData.append('filename', file.name)
    n8nFormData.append('timestamp', new Date().toISOString())

    // Send to n8n webhook
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

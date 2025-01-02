import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from 'redis'

type TokenData = {
  token: string
  customerEmail?: string
  expires: string
  created: string
  used: string
  sessionId: string
}

export async function POST(req: NextRequest) {
  let client;
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

    // Initialize Redis client
    client = createClient({
      url: process.env.REDIS_URL || ''
    })
    await client.connect()

    // Check if token exists and is valid
    const existingToken = await client.get(`upload_token:${token}`)
    if (!existingToken) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Parse and validate token data
    const tokenData = JSON.parse(existingToken) as TokenData
    
    // Check if token is already used
    if (tokenData.used === "true") {
      return NextResponse.json(
        { success: false, error: 'Token has already been used' },
        { status: 400 }
      )
    }

    // Get form data
    const formData = await req.formData()
    const file = formData.get('data0') as File | null
    const metadataJson = formData.get('metadata') as string | null

    // Validate file and metadata
    if (!file || !metadataJson) {
      return NextResponse.json(
        { success: false, error: 'Missing file or metadata' },
        { status: 400 }
      )
    }

    // Parse metadata
    let metadata;
    try {
      metadata = JSON.parse(metadataJson)
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid metadata format' },
        { status: 400 }
      )
    }

    const { email, formAnswers } = metadata

    // Validate email and formAnswers
    if (!email || !formAnswers || !Array.isArray(formAnswers) || formAnswers.length !== 6) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or form answers' },
        { status: 400 }
      )
    }

    // Prepare data for n8n
    const n8nFormData = new FormData()
    n8nFormData.append('data0', file, file.name)
    n8nFormData.append('email', email)
    n8nFormData.append('filename', file.name)
    n8nFormData.append('timestamp', new Date().toISOString())
    n8nFormData.append('token', token)
    n8nFormData.append('sessionId', tokenData.sessionId)

    // Append form answers
    formAnswers.forEach((answer: string, index: number) => {
      n8nFormData.append(`formAnswer${index + 1}`, answer)
    })

    // Send to n8n webhook
    const n8nResponse = await fetch(process.env.NEXT_PUBLIC_UPLOAD_ENDPOINT!, {
      method: 'POST',
      body: n8nFormData
    })

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text()
      throw new Error(`Failed to process file with n8n: ${errorText}`)
    }

    // Mark token as used in both Redis keys
    tokenData.used = "true"
    const redisPromises = [
      client.set(
        `upload_token:${token}`, 
        JSON.stringify(tokenData),
        { EX: 1800 }
      ),
      client.set(
        `payment:${tokenData.sessionId}`,
        JSON.stringify(tokenData),
        { EX: 1800 }
      )
    ] as const

    await Promise.all(redisPromises)

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
  } finally {
    if (client) {
      await client.disconnect().catch(console.error)
    }
  }
}

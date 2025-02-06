import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from 'redis'
import { supabase } from '@/lib/supabase'

type TokenData = {
  token: string
  customerEmail?: string
  expires: string
  created: string
  used: string
  sessionId: string
}

interface ProcessingError extends Error {
  code?: string
  details?: string
}

export async function POST(req: NextRequest) {
  let client;
  try {
    // Validate authorization token
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      console.error('Authorization token missing')
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unauthorized: Missing token',
          details: 'Please provide a valid authorization token'
        },
        { status: 401 }
      )
    }

    // Check if it's a mock token (pi_*_mock)
    const isMockToken = token.includes('_mock');
    console.log(`Processing ${isMockToken ? 'mock' : 'real'} token: ${token.substring(0, 8)}...`)
    
    if (!isMockToken) {
      // Validate Redis URL
      if (!process.env.REDIS_URL) {
        throw new Error('Redis URL not configured')
      }

      // Initialize Redis client for real tokens
      client = createClient({
        url: process.env.REDIS_URL
      })
      await client.connect()
      
      // Check if token exists and is valid
      const existingToken = await client.get(`upload_token:${token}`)
      if (!existingToken) {
        console.error(`Invalid token attempted: ${token.substring(0, 8)}...`)
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid or expired token',
            details: 'The provided token is either invalid or has expired'
          },
          { status: 401 }
        )
      }
      
      // Parse and validate token data
      const tokenData = JSON.parse(existingToken) as TokenData
      
      // Check if token is already used
      if (tokenData.used === "true") {
        console.error(`Attempted to reuse token: ${token.substring(0, 8)}...`)
        return NextResponse.json(
          { 
            success: false, 
            error: 'Token has already been used',
            details: 'This upload token has already been used and cannot be used again'
          },
          { status: 400 }
        )
      }
    }

    // Get and validate form data
    const formData = await req.formData()
    const file = formData.get('data0') as File | null
    const metadataStr = formData.get('metadata') as string | null
    const email = formData.get('email') as string | null
    
    // Validate file
    if (!file) {
      console.error('File missing in upload request')
      return NextResponse.json(
        { 
          success: false, 
          error: 'No file provided',
          details: 'Please ensure a file is included in the upload request'
        },
        { status: 400 }
      )
    }

    // Validate file type and size
    if (!file.type.includes('pdf')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid file type',
          details: 'Only PDF files are accepted'
        },
        { status: 400 }
      )
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'File too large',
          details: 'Maximum file size is 2MB'
        },
        { status: 400 }
      )
    }

    // Parse metadata
    let metadata: { email: string; token: string; sessionId: string } | null = null
    try {
      metadata = metadataStr ? JSON.parse(metadataStr) : { email, token, sessionId: formData.get('sessionId') as string }
    } catch (error) {
      console.error('Metadata parsing error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid metadata format',
          details: 'The provided metadata could not be parsed'
        },
        { status: 400 }
      )
    }

    if (!metadata?.sessionId) {
      console.error('Session ID missing in request')
      return NextResponse.json(
        { 
          success: false, 
          error: 'Session ID is required',
          details: 'A valid session ID must be provided with the upload request'
        },
        { status: 400 }
      )
    }

    // Validate email
    if (!metadata.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(metadata.email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid email',
          details: 'Please provide a valid email address'
        },
        { status: 400 }
      )
    }

    console.log(`Processing upload for session ${metadata.sessionId}`)

    // Update Supabase status
    const { error: supabaseError } = await supabase
      .from('policies')
      .update({ status: 'processing' })
      .match({ session_id: metadata.sessionId })

    if (supabaseError) {
      console.error('Supabase update error:', supabaseError)
      // Continue processing despite Supabase error
    }

    // Validate n8n endpoint
    if (!process.env.NEXT_PUBLIC_UPLOAD_ENDPOINT) {
      throw new Error('Upload endpoint not configured')
    }

    // Prepare data for n8n
    const n8nFormData = new FormData()
    n8nFormData.append('data0', file, file.name)
    n8nFormData.append('email', metadata.email)
    n8nFormData.append('filename', file.name)
    n8nFormData.append('timestamp', new Date().toISOString())
    n8nFormData.append('token', token)
    n8nFormData.append('sessionId', metadata.sessionId)

    // Send to n8n webhook
    const response = await fetch(process.env.NEXT_PUBLIC_UPLOAD_ENDPOINT, {
      method: 'POST',
      body: n8nFormData
    })

    if (!response.ok) {
      const responseText = await response.text()
      console.error('n8n processing error:', responseText)
      throw new Error('Failed to process file with n8n')
    }

    // Only update Redis if it's not a mock token
    if (!isMockToken && client) {
      const tokenData = {
        token,
        used: "true",
        created: new Date().toISOString(),
        expires: new Date(Date.now() + 1800000).toISOString(),
        sessionId: metadata.sessionId
      }
      
      try {
        const redisPromises = [
          client.set(
            `upload_token:${token}`, 
            JSON.stringify(tokenData),
            { EX: 1800 }
          ),
          client.set(
            `payment:${token}`,
            JSON.stringify(tokenData),
            { EX: 1800 }
          )
        ] as const
        await Promise.all(redisPromises)
      } catch (redisError) {
        console.error('Redis update error:', redisError)
        // Continue despite Redis error as the upload was successful
      }
    }

    console.log(`Upload successful for session ${metadata.sessionId}`)
    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      sessionId: metadata.sessionId
    })

  } catch (error) {
    console.error('Upload processing error:', error)
    const processingError = error as ProcessingError
    return NextResponse.json(
      { 
        success: false, 
        error: processingError.message || 'Failed to process upload',
        code: processingError.code,
        details: processingError.details || 'An unexpected error occurred during file processing'
      },
      { status: 500 }
    )
  } finally {
    if (client) {
      try {
        await client.disconnect()
      } catch (disconnectError) {
        console.error('Redis disconnect error:', disconnectError)
      }
    }
  }
}

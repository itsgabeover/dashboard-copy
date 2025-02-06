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

    // Check if it's a mock token (pi_*_mock)
    const isMockToken = token.includes('_mock');
    
    if (!isMockToken) {
      // Initialize Redis client for real tokens
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
    }

    // Get form data
    const formData = await req.formData()
    const file = formData.get('data0') as File | null
    const metadataStr = formData.get('metadata') as string | null
    
    // Validate file
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Parse metadata
    let metadata: { email: string; token: string; sessionId: string } | null = null
    try {
      metadata = metadataStr ? JSON.parse(metadataStr) : null
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid metadata format' },
        { status: 400 }
      )
    }

    if (!metadata?.sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Update Supabase status
    const { error: supabaseError } = await supabase
      .from('policies')
      .update({ status: 'processing' })
      .match({ session_id: metadata.sessionId })

    if (supabaseError) {
      console.error('Supabase update error:', supabaseError)
    }

    // Prepare data for n8n
    const n8nFormData = new FormData()
    n8nFormData.append('data0', file, file.name)
    n8nFormData.append('email', metadata.email || '')
    n8nFormData.append('filename', file.name)
    n8nFormData.append('timestamp', new Date().toISOString())
    n8nFormData.append('token', token)
    n8nFormData.append('sessionId', metadata.sessionId)

    // Send to n8n webhook
    const response = await fetch(process.env.NEXT_PUBLIC_UPLOAD_ENDPOINT!, {
      method: 'POST',
      body: n8nFormData
    })

    if (!response.ok) {
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
    }

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      sessionId: metadata.sessionId
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
      try {
        await client.disconnect()
      } catch (disconnectError) {
        console.error('Redis disconnect error:', disconnectError)
      }
    }
  }
}

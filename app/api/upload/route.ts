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
    const file = formData.get('file') as File | null
    
    // Validate file only
    if (!file) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No file provided'
        },
        { status: 400 }
      )
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
      try {
        await client.disconnect()
      } catch (disconnectError) {
        console.error('Redis disconnect error:', disconnectError)
      }
    }
  }
}

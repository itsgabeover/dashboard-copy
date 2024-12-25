// /insurance-planner/app/api/verify-payment/route.ts

import { NextResponse } from 'next/server'
import { createClient } from 'redis'

// TypeScript interface for type safety
interface TokenData {
  token: string
  customerEmail: string
  expires: string
  created: string
  used: boolean
  sessionId: string
}

export async function GET(request: Request) {
  // Create Redis client outside of try block
  const client = createClient({
    url: process.env.REDIS_URL || '' // Fallback for type safety
  })

  try {
    // Parse URL params safely
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')
    
    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'Missing session_id' }, 
        { status: 400 }
      )
    }

    // Connect to Redis
    await client.connect()
    
    // Get token data
    const data = await client.get(`payment:${sessionId}`)
    
    if (!data) {
      return NextResponse.json({ 
        success: false, 
        status: 'pending',
        message: 'Token not found' 
      })
    }

    // Parse with type safety
    const tokenData = JSON.parse(data) as TokenData
    
    // Validate expiration
    if (new Date(tokenData.expires) < new Date()) {
      return NextResponse.json({ 
        success: false, 
        message: 'Token expired' 
      }, { status: 400 })
    }

    // Check usage
    if (tokenData.used) {
      return NextResponse.json({ 
        success: false, 
        message: 'Token already used' 
      }, { status: 400 })
    }

    // Return success with token
    return NextResponse.json({ 
      success: true,
      token: tokenData.token,
      status: 'success'
    })

  } catch (error) {
    // Proper error logging for Vercel
    console.error('[Verify Payment Error]:', error)
    
    return NextResponse.json({ 
      success: false, 
      message: 'Server error' 
    }, { status: 500 })
  } finally {
    // Always disconnect from Redis
    try {
      await client.disconnect()
    } catch (error) {
      console.error('[Redis Disconnect Error]:', error)
    }
  }
}

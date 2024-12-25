// app/api/store-token/route.ts
import { NextResponse } from 'next/server'
import { createClient } from 'redis'

interface TokenData {
  token: string
  customerEmail: string
  expires: string
  created: string
  used: boolean
  sessionId: string  // Added for Stripe session tracking
}

export async function POST(request: Request) {
  const client = createClient({
    url: process.env.REDIS_URL
  })
  
  try {
    const { 
      token, 
      customerEmail, 
      expires, 
      created, 
      used,
      sessionId  // Added to receive from n8n
    } = await request.json()
    
    await client.connect()
    
    // Store token data with two keys for bi-directional lookup
    await Promise.all([
      // Store by token for upload validation
      client.set(
        `upload_token:${token}`, 
        JSON.stringify({
          token,
          customerEmail,
          expires,
          created,
          used,
          sessionId
        } as TokenData),
        { EX: 1800 }  // 30 minutes
      ),
      // Store by sessionId for payment success page
      client.set(
        `payment:${sessionId}`,
        JSON.stringify({
          token,
          customerEmail,
          expires,
          created,
          used,
          sessionId
        } as TokenData),
        { EX: 1800 }  // 30 minutes
      )
    ])

    return NextResponse.json({
      success: true,
      message: 'Token stored successfully'
    })
  } catch (error) {
    console.error('Store token error:', error)
    return NextResponse.json({ error: 'Failed to store token' }, { status: 500 })
  } finally {
    await client.disconnect()
  }
}

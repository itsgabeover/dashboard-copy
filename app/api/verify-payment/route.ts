import { NextResponse } from 'next/server'
import { createClient } from 'redis'

type TokenData = {
  token: string
  customerEmail?: string
  expires: string
  created: string
  used: string
  sessionId: string
}

export async function GET(request: Request): Promise<NextResponse> {
  let client;
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')
    
    console.log('Verifying payment for session:', sessionId)

    if (!sessionId) {
      return NextResponse.json({ 
        success: false, 
        message: 'No session ID provided' 
      }, { status: 400 })
    }

    client = createClient({
      url: process.env.REDIS_URL || ''
    })
    await client.connect()
    
    const data = await client.get(`payment:${sessionId}`)
    console.log('Session check:', { sessionId, hasData: !!data })

    if (!data) {
      return NextResponse.json({ 
        success: false,
        status: 'pending',
        message: 'Token not found' 
      })
    }

    const tokenData = JSON.parse(data) as TokenData
    console.log('Token check:', { 
      hasToken: !!tokenData.token,
      used: tokenData.used 
    })

    // Validate the token data
    if (!tokenData.token || !tokenData.expires) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid token data' 
      }, { status: 400 })
    }

    // Check if token is expired
    if (new Date(tokenData.expires) < new Date()) {
      return NextResponse.json({ 
        success: false, 
        message: 'Token expired' 
      }, { status: 400 })
    }

    if (tokenData.used !== "false") {
      return NextResponse.json({ 
        success: false, 
        message: 'Token already used' 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true,
      token: tokenData.token,
      status: 'success' 
    })

  } catch (error) {
    console.error('Verify payment error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error'
    })
    
    return NextResponse.json({ 
      success: false,
      message: error instanceof Error ? error.message : 'Server error'
    }, { status: 500 })

  } finally {
    if (client) {
      try {
        await client.disconnect()
      } catch (error) {
        console.error('Redis disconnect error:', error)
      }
    }
  }
}

// app/api/verify-payment/route.ts
import { NextResponse } from 'next/server'
import { createClient } from 'redis'

type TokenData = {
  token: string
  customerEmail: string
  expires: string
  created: string
  used: boolean
  sessionId: string
}

export async function GET(request: Request) {
  const client = createClient({
    url: process.env.REDIS_URL || '' // Added fallback for type safety
  })

  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')
    
    if (!sessionId) {
      return NextResponse.json({ 
        success: false, 
        status: 'error',
        message: 'No session ID provided' 
      }, { status: 400 })
    }

    console.log('Checking session:', sessionId)
    
    await client.connect()
    const data = await client.get(`payment:${sessionId}`)
    console.log('Found data:', data)

    if (!data) {
      return NextResponse.json({ 
        success: false,
        status: 'pending',
        message: 'Token not found' 
      })
    }

    const tokenData = JSON.parse(data) as TokenData
    console.log('Token status:', tokenData.used)

    if (tokenData.used) {
      return NextResponse.json({ 
        success: false,
        status: 'error', 
        message: 'Token already used' 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true,
      token: tokenData.token,
      status: 'success' 
    })

  } catch (error) {
    console.error('Verify payment error:', error)
    return NextResponse.json({ 
      success: false,
      status: 'error',
      message: error instanceof Error ? error.message : 'Server error'
    }, { status: 500 })
  } finally {
    await client.disconnect()
  }
}

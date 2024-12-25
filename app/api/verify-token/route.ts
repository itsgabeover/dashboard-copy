// app/api/verify-token/route.ts
import { NextResponse } from 'next/server'
import { createClient } from 'redis'

interface TokenData {
  token: string
  customerEmail: string
  expires: string
  created: string
  used: boolean
}

export async function POST(request: Request) {
  const client = createClient({
    url: process.env.REDIS_URL as string
  })

  try {
    const { token } = (await request.json()) as { token?: string }
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    await client.connect()
    
    // Check if token exists and is valid
    const existingToken = await client.get(`upload_token:${token}`)
    
    if (!existingToken) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Token exists - check if used
    const tokenData = JSON.parse(existingToken) as TokenData
    
    if (tokenData.used) {
      return NextResponse.json(
        { error: 'Token has already been used' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      valid: true,
      customerEmail: tokenData.customerEmail
    })

  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await client.disconnect()
  }
}

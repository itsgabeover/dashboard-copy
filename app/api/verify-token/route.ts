// app/api/verify-token/route.ts
import { NextResponse } from 'next/server'
import { createClient } from 'redis'

export async function POST(request: Request) {
  const client = createClient({
    url: process.env.REDIS_URL
  })

  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    await client.connect()

    // First, check if token exists and is valid
    const existingToken = await client.get(`upload_token:${token}`)
    
    if (existingToken) {
      // Token exists in Redis - check if used
      const tokenData = JSON.parse(existingToken)
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
    }

    // Token doesn't exist in Redis - store it from n8n data
    // This simulates the data we would have gotten from n8n
    const newTokenData = {
      token,
      created: new Date().toISOString(),
      expires: new Date(Date.now() + 30 * 60000).toISOString(), // 30 min
      customerEmail: 'test@example.com', // This would come from Stripe
      used: false
    }

    // Store in Redis
    await client.set(
      `upload_token:${token}`, 
      JSON.stringify(newTokenData),
      { EX: 1800 } // 30 minutes expiration
    )

    return NextResponse.json({
      valid: true,
      customerEmail: newTokenData.customerEmail
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
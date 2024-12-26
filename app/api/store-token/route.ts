// app/api/store-token/route.ts
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

export async function POST(request: Request) {
  const client = createClient({
    url: process.env.REDIS_URL || '' // Added fallback for type safety
  })
  
  try {
    const body = await request.json() as TokenData
    console.log('Received data to store:', body)

    await client.connect()
    console.log('Redis connected')
    
    const tokenData = {
      ...body,
      used: false
    }

    await Promise.all([
      client.set(
        `upload_token:${body.token}`, 
        JSON.stringify(tokenData),
        { EX: 1800 }
      ),
      client.set(
        `payment:${body.sessionId}`,
        JSON.stringify(tokenData),
        { EX: 1800 }
      )
    ])

    const storedData = await client.get(`payment:${body.sessionId}`)
    console.log('Stored data:', storedData)

    return NextResponse.json({
      success: true,
      message: 'Token stored successfully'
    })
  } catch (error) {
    console.error('Store token error:', error)
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Failed to store token' 
    }, { status: 500 })
  } finally {
    await client.disconnect()
  }
}

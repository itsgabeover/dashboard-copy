// app/api/store-token/route.ts
import { NextResponse } from 'next/server'
import { createClient } from 'redis'

type TokenData = {
  token: string
  customerEmail?: string // Optional since some events might not have email
  expires: string
  created: string
  used: boolean
  sessionId: string
}

type RequestBody = {
  token: string
  customerEmail?: string
  expires: string
  created: string
  used: string // Coming as string from n8n
  sessionId: string
}

export async function POST(request: Request): Promise<NextResponse> {
  const client = createClient({
    url: process.env.REDIS_URL || ''
  })
  
  try {
    const body = await request.json() as RequestBody
    console.log('Received data to store:', body)

    if (!body.sessionId?.startsWith('cs_live_')) {
      return NextResponse.json({
        success: false,
        message: 'Not a checkout session'
      }, { status: 400 })
    }

    if (!body.token || !body.expires || !body.created) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields'
      }, { status: 400 })
    }

    await client.connect()
    console.log('Redis connected')
    
    const tokenData: TokenData = {
      token: body.token,
      customerEmail: body.customerEmail,
      expires: body.expires,
      created: body.created,
      used: body.used === "false" ? false : true,
      sessionId: body.sessionId
    }

    const redisPromises = [
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
    ] as const

    await Promise.all(redisPromises)

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
      message: error instanceof Error ? error.message : 'Failed to store token' 
    }, { status: 500 })
  } finally {
    try {
      await client.disconnect()
    } catch (error) {
      console.error('Redis disconnect error:', error)
    }
  }
}

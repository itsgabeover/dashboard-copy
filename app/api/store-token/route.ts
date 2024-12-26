// app/api/store-token/route.ts
import { NextResponse } from 'next/server'
import { createClient } from 'redis'

// Types at the top
type TokenData = {
  readonly token: string
  readonly customerEmail?: string
  readonly expires: string
  readonly created: string
  readonly used: string
  readonly sessionId: string
}

type RequestBody = Omit<TokenData, 'used'> & {
  used: string
}

export async function POST(request: Request): Promise<NextResponse> {
  let client;
  
  try {
    // Parse and validate request body
    const body: RequestBody = await request.json()
    console.log('Received data to store:', body)

    // Early validations before Redis connection
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

    // Initialize Redis client
    client = createClient({
      url: process.env.REDIS_URL || ''
    })

    await client.connect()
    
    // Prepare token data with explicit type
    const tokenData: TokenData = {
      token: body.token,
      customerEmail: body.customerEmail,
      expires: body.expires,
      created: body.created,
      used: "false",
      sessionId: body.sessionId
    }

    // Redis operations with explicit typing
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
    if (client) {
      try {
        await client.disconnect()
      } catch (disconnectError) {
        console.error('Redis disconnect error:', disconnectError)
      }
    }
  }
}

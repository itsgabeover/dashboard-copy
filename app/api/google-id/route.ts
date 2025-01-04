// app/api/store-token/store-google-doc-id.ts
import { NextResponse } from 'next/server'
import { createClient } from 'redis'

// Types at the top
type DocData = {
  readonly docId: string
  readonly customerEmail?: string
  readonly sessionId: string
}

type RequestBody = DocData

export async function POST(request: Request): Promise<NextResponse> {
  let client;
  
  try {
    // Parse and validate request body
    const body: RequestBody = await request.json()
    console.log('Received doc data to store:', body)

    // Early validations before Redis connection
    if (!body.sessionId?.startsWith('cs_live_')) {
      return NextResponse.json({
        success: false,
        message: 'Not a checkout session'
      }, { status: 400 })
    }

    if (!body.docId) {
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
    
    // Prepare doc data with explicit type
    const docData: DocData = {
      docId: body.docId,
      customerEmail: body.customerEmail,
      sessionId: body.sessionId
    }

    // Redis operations with explicit typing
    const redisPromises = [
      client.set(
        `doc:${body.sessionId}`, 
        JSON.stringify(docData),
        { EX: 1800 }
      ),
      client.set(
        `doc_payment:${body.sessionId}`,
        JSON.stringify(docData),
        { EX: 1800 }
      )
    ] as const

    await Promise.all(redisPromises)

    return NextResponse.json({
      success: true,
      message: 'Doc ID stored successfully'
    })

  } catch (error) {
    console.error('Store doc ID error:', error)
    return NextResponse.json({ 
      success: false,
      message: error instanceof Error ? error.message : 'Failed to store doc ID' 
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
// Add this GET handler to your existing app/api/google-id/route.ts file
export async function GET(request: Request): Promise<NextResponse> {
  let client;
  
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId?.startsWith('cs_live_')) {
      return NextResponse.json({
        success: false,
        message: 'Not a checkout session'
      }, { status: 400 })
    }

    client = createClient({
      url: process.env.REDIS_URL || ''
    })
    await client.connect()

    const data = await client.get(`doc:${sessionId}`)

    if (!data) {
      return NextResponse.json({
        success: false,
        message: 'Document not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: JSON.parse(data)
    })

  } catch (error) {
    console.error('Get doc ID error:', error)
    return NextResponse.json({ 
      success: false,
      message: error instanceof Error ? error.message : 'Failed to retrieve doc ID' 
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

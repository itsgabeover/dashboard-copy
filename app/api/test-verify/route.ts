// app/api/test-verify/route.ts
import { NextResponse } from 'next/server'
import { createClient } from 'redis'

export async function GET() {
  try {
    // Create Redis client
    const client = createClient({
      url: process.env.REDIS_URL
    })

    // Connect to Redis
    await client.connect()

    // Create a test token
    const testToken = `test_${Date.now()}`
    
    // Store test data in Redis
    await client.set(`upload_token:${testToken}`, JSON.stringify({
      created: new Date().toISOString(),
      expires: new Date(Date.now() + 30 * 60000).toISOString(),
      customerEmail: 'test@example.com',
      used: false
    }))

    // Get the stored data to verify
    const storedData = await client.get(`upload_token:${testToken}`)
    
    // Disconnect from Redis
    await client.disconnect()

    return NextResponse.json({
      success: true,
      testToken,
      storedData: JSON.parse(storedData || '{}')
    })
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Test failed'
    }, { status: 500 })
  }
}
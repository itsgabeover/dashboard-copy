// app/api/test-flow/route.ts
import { NextResponse } from 'next/server'
import { createClient } from 'redis'

export async function GET() {
  const client = createClient({
    url: process.env.REDIS_URL
  })

  try {
    await client.connect()
    
    // 1. Generate test token
    const testToken = `test_${Date.now()}`
    const tokenData = {
      token: testToken,
      created: new Date().toISOString(),
      expires: new Date(Date.now() + 30 * 60000).toISOString(),
      customerEmail: 'test@example.com',
      used: false
    }

    // 2. Test verification (first time)
    const verifyResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/verify-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: testToken })
    })
    const verifyResult = await verifyResponse.json()

    // 3. Get Redis data
    const storedData = await client.get(`upload_token:${testToken}`)

    // 4. Check upload page URL
    const uploadUrl = `${process.env.VERCEL_URL || 'http://localhost:3000'}/upload?token=${testToken}`

    return NextResponse.json({
      success: true,
      testToken,
      initialData: tokenData,
      verificationResult: verifyResult,
      storedInRedis: JSON.parse(storedData || '{}'),
      uploadUrl
    })
  } catch (error) {
    console.error('Test flow error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Test failed'
    }, { status: 500 })
  } finally {
    await client.disconnect()
  }
}
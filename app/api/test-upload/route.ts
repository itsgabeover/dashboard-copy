// app/api/test-upload/route.ts
import { NextResponse } from 'next/server'
import { createClient } from 'redis'

export async function GET() {
  const client = createClient({
    url: process.env.REDIS_URL
  })

  try {
    await client.connect()

    // Step 1: Create and store test token
    const testToken = `test_${Date.now()}`
    const tokenData = {
      created: new Date().toISOString(),
      expires: new Date(Date.now() + 30 * 60000).toISOString(),
      customerEmail: 'test@example.com',
      used: false
    }
    
    await client.set(`upload_token:${testToken}`, JSON.stringify(tokenData))

    // Step 2: Create test FormData with a simple PDF
    const formData = new FormData()
    const testPdfBlob = new Blob(['Test PDF Content'], { type: 'application/pdf' })
    formData.append('file', testPdfBlob, 'test.pdf')
    formData.append('email', 'test@example.com')
    formData.append('token', testToken)

    // Step 3: Test file upload
    const uploadResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/upload`, {
      method: 'POST',
      body: formData,
    })

    const uploadResult = await uploadResponse.json()

    // Get final token state from Redis
    const finalTokenData = await client.get(`upload_token:${testToken}`)

    return NextResponse.json({
      success: true,
      testToken,
      initialData: tokenData,
      uploadResult,
      finalTokenState: JSON.parse(finalTokenData || '{}')
    })
  } catch (error) {
    console.error('Test upload error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Test failed'
    }, { status: 500 })
  } finally {
    await client.disconnect()
  }
}
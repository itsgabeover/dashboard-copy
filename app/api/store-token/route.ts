// app/api/store-token/route.ts
import { NextResponse } from 'next/server'
import { createClient } from 'redis'

export async function POST(request: Request) {
  const client = createClient({
    url: process.env.REDIS_URL
  })

  try {
    const { token, customerEmail, expires, created, used } = await request.json()
    
    await client.connect()
    
    await client.set(`upload_token:${token}`, JSON.stringify({
      token,
      customerEmail,
      expires,
      created,
      used
    }), { EX: 1800 }) // 30 minutes

    return NextResponse.json({
      success: true,
      message: 'Token stored successfully'
    })
  } catch (error) {
    console.error('Store token error:', error)
    return NextResponse.json({ error: 'Failed to store token' }, { status: 500 })
  } finally {
    await client.disconnect()
  }
}
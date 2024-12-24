import { NextResponse } from 'next/server';
import { createClient } from 'redis';

export async function GET() {
  try {
    // Create Redis client
    const client = createClient({
      url: process.env.REDIS_URL
    });

    // Connect to Redis
    await client.connect();

    // Test write
    await client.set('test-key', 'test-value');
    
    // Test read
    const value = await client.get('test-key');
    
    // Test delete
    await client.del('test-key');

    // Disconnect
    await client.disconnect();
    
    return NextResponse.json({
      success: true,
      message: 'Redis connection working',
      testValue: value
    });
  } catch (error) {
    console.error('Redis test error:', error);
    return NextResponse.json(
      { error: 'Redis connection failed', details: error.message },
      { status: 500 }
    );
  }
}
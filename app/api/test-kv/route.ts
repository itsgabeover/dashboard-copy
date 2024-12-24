import { NextResponse } from 'next/server';
import { createClient } from 'redis';

// Define a type guard for Error objects
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

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
  } catch (error: unknown) {
    // Log the full error for debugging
    console.error('Redis test error:', error);
    
    // Get error message based on error type
    const errorMessage = isError(error) 
      ? error.message 
      : typeof error === 'string'
        ? error
        : 'An unknown error occurred';

    return NextResponse.json(
      { 
        error: 'Redis connection failed', 
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}

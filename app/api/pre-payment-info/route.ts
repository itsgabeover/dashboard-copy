import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Ensure we're receiving JSON
    const contentType = request.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 415 }
      )
    }

    const data = await request.json()

    // Validate the required fields
    if (!data.planType || !data.paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Process the pre-payment info
    const response = {
      success: true,
      sessionId: 'test_session_' + Date.now(),
      planDetails: {
        type: data.planType,
        amount: data.planType === 'premium' ? 99.99 : 49.99,
        currency: 'USD'
      }
    }

    // Return JSON response with proper headers
    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('Pre-payment processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
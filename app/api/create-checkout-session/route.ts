import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    // Validate content type
    const contentType = req.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 415 }
      )
    }

    // Validate Stripe key
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Missing Stripe secret key')
      return NextResponse.json(
        { error: 'Stripe configuration error' },
        { status: 500 }
      )
    }

    // Parse and validate request body
    const body = await req.json()
    if (!body.success_url || !body.cancel_url) {
      return NextResponse.json(
        { error: 'Missing success_url or cancel_url' },
        { status: 400 }
      )
    }

    console.log('Creating checkout session with URLs:', {
      success_url: body.success_url,
      cancel_url: body.cancel_url
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Policy Review',
              description: 'AI-powered insurance policy review'
            },
            unit_amount: 75, // $.75
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${body.success_url}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: body.cancel_url,
      metadata: {
        timestamp: new Date().toISOString(),
        service_type: 'policy review',
        created_at: new Date().toISOString()
      }
    })

    if (!session?.url) {
      throw new Error('Failed to generate checkout URL')
    }

    console.log('Checkout session created:', session.id)
    return NextResponse.json({ url: session.url })

  } catch (err) {
    console.error('Stripe session creation error:', {
      error: err,
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined
    })

    return NextResponse.json(
      { 
        error: 'Payment session creation failed',
        details: err instanceof Error ? err.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

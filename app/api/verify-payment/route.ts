import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

interface PaymentData {
    payment_id: string;
    status: string;
    amount: number;
    session_id: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const data: PaymentData = await req.json()

    if (!data.session_id) {
      return NextResponse.json({ success: false, message: 'Missing session_id' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(data.session_id)

    if (session.payment_status === 'paid') {
      // Generate a token for the upload page
      const token = generateToken() // You need to implement this function

      // Here you would typically store the token and associate it with the payment
      // For now, we'll just return it
      return NextResponse.json({ success: true, token })
    } else {
      return NextResponse.json({ success: false, message: 'Payment not completed' }, { status: 400 })
    }
  } catch (err: any) {
    console.error('Stripe error:', err)
    return NextResponse.json({ success: false, message: err.message || 'An error occurred while verifying the payment' }, { status: 500 })
  }
}

// Implement a function to generate a unique token
function generateToken(): string {
  // This is a simple implementation. In a real-world scenario, you'd want to use a more secure method.
  return Math.random().toString(36).substr(2, 9)
}


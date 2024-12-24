import { NextResponse } from 'next/server'

interface PaymentData {
    payment_id: string;
    status: string;
    amount: number;
    token: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const data: PaymentData = await req.json()

    if (!data.token) {
      return NextResponse.json({ success: false, message: 'Missing token' }, { status: 400 })
    }

    // Here you would typically verify the token with n8n
    // For this example, we'll simulate a successful verification
    // In a real scenario, you'd make an API call to n8n to verify the token

    // Simulated verification (replace this with actual n8n verification)
    const isVerified = true // This should be the result of your n8n verification

    if (isVerified) {
      return NextResponse.json({ success: true, message: 'Payment verified successfully' })
    } else {
      return NextResponse.json({ success: false, message: 'Payment verification failed' }, { status: 400 })
    }
  } catch (err: unknown) {
    console.error('Verification error:', err)
    const message = err instanceof Error ? err.message : 'An error occurred while verifying the payment'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}


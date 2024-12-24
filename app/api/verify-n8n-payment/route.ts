import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { token } = await req.json()

    if (!token) {
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
  } catch (err: any) {
    console.error('Verification error:', err)
    return NextResponse.json({ success: false, message: err.message || 'An error occurred while verifying the payment' }, { status: 500 })
  }
}


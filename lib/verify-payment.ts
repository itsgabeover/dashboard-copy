import { stripe } from './stripe'

export async function verifyPayment(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    return {
      success: session.payment_status === 'paid',
      customerId: session.customer,
      paymentIntentId: session.payment_intent,
      amount: session.amount_total,
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    throw new Error('Failed to verify payment')
  }
} 
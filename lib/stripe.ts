import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

// Log to verify the key is loaded (will be hidden in logs)
console.log('Stripe key loaded:', process.env.STRIPE_SECRET_KEY.slice(0, 7) + '...')

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',  // Updated to latest stable version
  typescript: true,
  appInfo: {
    name: 'Insurance Planner AI',
    version: '1.0.0'
  }
})

export const PRICE_AMOUNT = 50 // $.50 in cents
export const CURRENCY = 'usd'
export const PRODUCT_NAME = 'Policy Review'

'use client'
import { useState } from 'react'

interface PaymentError {
  message: string
  code?: string
}

export function PrePaymentForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<PaymentError | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/pre-payment-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: 'premium',
          paymentMethod: 'card'
        })
      })

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        throw new Error('Expected JSON response but received different content type')
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Payment processing failed')
      }

      const data = await response.json()
      // Handle successful response
      console.log('Payment session created:', data)
      
      // Redirect to payment page or handle next steps
      // window.location.href = data.paymentUrl

    } catch (err) {
      console.error('Payment processing error:', err)
      setError({
        message: err instanceof Error ? err.message : 'Payment processing failed',
        code: 'PAYMENT_ERROR'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Add your form fields here */}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
            {error.message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-primary-blue text-white py-2 px-4 rounded-md 
            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-secondary-blue'}`}
        >
          {loading ? 'Processing...' : 'Continue to Payment'}
        </button>
      </form>
    </div>
  )
} 
'use client'
import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from 'next/navigation'

export default function PrePaymentInfoPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handlePayment = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success_url: `${window.location.origin}/payment-success`,
          cancel_url: `${window.location.origin}/pre-payment-info`,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const { url } = await response.json()
      if (!url) {
        throw new Error('No URL returned from checkout session creation')
      }

      router.push(url)
    } catch (error) {
      console.error('Payment error:', error)
      alert(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or contact support.`)
    } finally {
      setIsLoading(false)
    }
  }

  const benefits = [
    "Comprehensive policy review within minutes",
    "AI-powered analysis for accurate insights",
    "Professional advisor report and client-ready summary",
    "Identify potential risks and optimization opportunities",
    "Enhance your client relationships with regular reviews"
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-[#4B6FEE] mb-6 text-center">
          Ready to Transform Your Policy Reviews?
        </h1>
        <p className="text-xl text-gray-600 mb-12 text-center">
          Get started with your first AI-powered life insurance policy analysis
        </p>
        <Card className="bg-white p-8 shadow-lg rounded-xl mb-12">
          <h2 className="text-2xl font-semibold text-[#4B6FEE] mb-6">What You&apos;ll Get:</h2>
          <p>You&apos;ll receive:</p>
          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="text-green-500 mr-3 h-5 w-5 flex-shrink-0 mt-1" />
                <span className="text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="bg-white p-8 shadow-lg rounded-xl mb-12">
          <h2 className="text-2xl font-semibold text-[#4B6FEE] mb-6">Pricing:</h2>
          <p className="text-3xl font-bold text-gray-800 mb-4">$20 per Policy Review</p>
          <p className="text-gray-600 mb-6">
            No subscription required. Pay only when you need it.
          </p>
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-green-700 mb-2">No-Risk First Purchase Guarantee:</h3>
            <p className="text-gray-700">
              Try your first policy review with complete confidence. Not satisfied? Get a full refund within 14 days - no questions asked.
            </p>
          </div>
        </Card>
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#4B6FEE] mb-6">Ready to Start?</h2>
          <Button
            onClick={handlePayment}
            disabled={isLoading}
            className="bg-[#4B6FEE] hover:bg-[#3B4FDE] text-white font-bold py-2 px-4 rounded"
          >
            {isLoading ? 'Processing...' : 'Proceed to Payment'}
          </Button>
        </div>
      </div>
    </main>
  )
}

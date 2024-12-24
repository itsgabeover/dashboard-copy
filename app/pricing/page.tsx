'use client'

import { useState } from 'react'
import { CheckCircle, Zap } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

declare global {
  interface Window {
    Stripe?: any;
  }
}

interface PricingData {
    id: string;
    name: string;
    price: number;
    features: string[];
}

export default function PricingPage() {
  const router = useRouter()

  const pricing: PricingData[] = [
    // pricing data...
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0]">
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#4B6FEE] mb-4">Simple, Transparent Pricing</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">$20 per Policy Review</h2>
          
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mb-12">
            <div className="p-8">
              <h3 className="text-2xl font-semibold mb-6 text-[#4B6FEE]">What You Get:</h3>
              <ul className="text-left text-lg text-gray-700 space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 h-6 w-6" />
                  Comprehensive technical analysis for advisors
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 h-6 w-6" />
                  Professional client-ready summary
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 h-6 w-6" />
                  Both reports delivered within minutes
                </li>
              </ul>
              
              <div className="bg-green-50 rounded-lg p-6 mb-8">
                <h4 className="text-xl font-semibold mb-2 text-green-700">No-Risk First Purchase Guarantee:</h4>
                <p className="text-gray-700">
                  Try your first policy review with complete confidence. Not satisfied? Get a full refund within 14 days - no questions asked.
                </p>
              </div>
              
              <Button 
                onClick={() => router.push('/pre-payment-info')}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Start Your Analysis
              </Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-2xl font-semibold mb-6 text-[#4B6FEE]">Includes:</h3>
              <ul className="text-left text-gray-700 space-y-3">
                {[
                  "Premium adequacy analysis",
                  "Performance metrics",
                  "Risk assessment",
                  "Action items",
                  "Client-ready explanations",
                  "Professional formatting"
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="text-green-500 mr-3 h-5 w-5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-2xl font-semibold mb-6 text-[#4B6FEE]">No surprises:</h3>
              <ul className="text-left text-gray-700 space-y-3">
                {[
                  "No subscription required",
                  "No minimum commitment",
                  "Pay only when you need it",
                  "Instant report delivery",
                  "100% satisfaction guarantee"
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <Zap className="text-[#4B6FEE] mr-3 h-5 w-5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-8">
            To request a refund, email <a href="mailto:support@financialplanner-ai.com" className="text-[#4B6FEE] hover:underline">support@financialplanner-ai.com</a>. Full terms and conditions in our Terms of Service.
          </p>
        </div>
      </section>
    </main>
  )
}


'use client'

import { Upload, Clock, FileText, CheckCircle, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { FC } from 'react'

export const Hero: FC = () => {
  return (
    <section className="bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0] py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#4B6FEE] mb-4 tracking-tight">
          Understand Your Life Insurance<br />
          <span className="text-4xl md:text-5xl lg:text-6xl">in 5 Minutes</span>
        </h1>
        <h2 className="text-2xl md:text-3xl mb-12 text-gray-600 font-light">
          AI-Powered Analysis to Protect Your Family&apos;s Future
        </h2>
        
        {/* Value Proposition Box */}
        <div className="max-w-4xl mx-auto mb-16 bg-white rounded-lg shadow-xl overflow-hidden transform transition-all hover:scale-105 duration-300">
          <div className="p-8">
            <h3 className="text-3xl font-bold mb-6 text-[#4B6FEE] flex items-center justify-center">
              <Zap className="w-8 h-8 mr-2" aria-hidden="true" /> 
              Know If Your Policy Is Working For You
            </h3>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              Your life insurance is too important to ignore. Get a clear picture of your policy&apos;s performance 
              and make sure your family&apos;s protection is on track - just like you&apos;d review your retirement accounts.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-gray-700 font-medium">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-2" aria-hidden="true" />
                <span>Detailed analysis for your advisor</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-2" aria-hidden="true" />
                <span>Clear summary you can understand</span>
              </div>
            </div>
            <p className="mt-6 text-xl font-semibold text-[#4B6FEE] flex items-center justify-center">
              <Upload className="w-6 h-6 mr-2" aria-hidden="true" />
              Just upload your in-force illustration to get started* (*Need an in-force illustration? Learn how to get one)
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-2xl font-semibold mb-8 text-[#4B6FEE]">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="bg-[#4B6FEE]/10 p-4 rounded-full mb-4">
                <Upload className="w-6 h-6 text-[#4B6FEE]" aria-hidden="true" />
              </div>
              <h4 className="text-lg font-semibold mb-2 text-[#4B6FEE]">Get Ready</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>Contact carrier for illustration</li>
                <li>Takes about a week</li>
                <li>We'll show you how</li>
              </ul>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-[#4B6FEE]/10 p-4 rounded-full mb-4">
                <Clock className="w-6 h-6 text-[#4B6FEE]" aria-hidden="true" />
              </div>
              <h4 className="text-lg font-semibold mb-2 text-[#4B6FEE]">Upload & Analyze</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>Share your in-force illustration</li>
                <li>AI analyzes hundreds of data points</li>
                <li>Takes just 5 minutes</li>
              </ul>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-[#4B6FEE]/10 p-4 rounded-full mb-4">
                <FileText className="w-6 h-6 text-[#4B6FEE]" aria-hidden="true" />
              </div>
              <h4 className="text-lg font-semibold mb-2 text-[#4B6FEE]">Get Two Reports</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>Expert analysis for your advisor</li>
                <li>Easy summary for you</li>
                <li>Both emailed instantly</li>
              </ul>
            </div>
          </div>
          <p className="text-gray-700 mt-8 text-base font-medium">
            That&apos;s it. No complicated process, no insurance agent required. Just answers you can trust in 5 minutes.
          </p>
        </div>

        {/* What You'll Learn */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-2xl font-semibold mb-8 text-[#4B6FEE]">What You&apos;ll Receive</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <h4 className="text-2xl font-semibold mb-6 text-center">Expert Policy Analysis</h4>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 h-5 w-5" aria-hidden="true" />
                  <span className="text-lg">Deep-Dive Coverage Review</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 h-5 w-5" aria-hidden="true" />
                  <span className="text-lg">How Your Policy is Working</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 h-5 w-5" aria-hidden="true" />
                  <span className="text-lg">Protection Check-Up</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 h-5 w-5" aria-hidden="true" />
                  <span className="text-lg">Expert Recommendations</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-[#4B6FEE] hover:bg-[#3B4FDE] text-white font-medium py-4 rounded-lg flex items-center justify-center gap-2">
                <Link href="/sample-report">
                  <FileText className="w-5 h-5" aria-hidden="true" /> View Sample Report
                </Link>
              </Button>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <h4 className="text-2xl font-semibold mb-6 text-center">Easy-to-Read Summary</h4>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 h-5 w-5" aria-hidden="true" />
                  <span className="text-lg">Your Coverage Made Clear</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 h-5 w-5" aria-hidden="true" />
                  <span className="text-lg">How You're Protected Today</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 h-5 w-5" aria-hidden="true" />
                  <span className="text-lg">What's Working Well</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 h-5 w-5" aria-hidden="true" />
                  <span className="text-lg">What to Do Next</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-[#4B6FEE] hover:bg-[#3B4FDE] text-white font-medium py-4 rounded-lg flex items-center justify-center gap-2">
                <Link href="/sample-action-plan">
                  <FileText className="w-5 h-5" aria-hidden="true" /> View Sample Plan
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden transform transition-all hover:scale-105 duration-300">
            <div className="bg-[#4B6FEE] text-white p-6">
              <h3 className="text-3xl font-bold mb-2 flex items-center justify-center">
                <Zap className="w-8 h-8 mr-2" aria-hidden="true" />
                Get Peace of Mind Today
              </h3>
              <p className="text-xl">See how your life insurance is really performing in just minutes</p>
            </div>
            <div className="p-8">
              <div className="flex justify-center mt-8">
                <Button asChild className="bg-[#22C55E] text-white hover:bg-[#16A34A] text-lg px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center">
                  <Link href="/upload">
                    Review My Policy
                    <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

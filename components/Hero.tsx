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
          AI-Powered Life Insurance Clarity
        </h1>
        <h2 className="text-2xl md:text-3xl mb-12 text-gray-600 font-light">
          Complex policies analyzed in minutes, not hours
        </h2>
        
        <div className="max-w-4xl mx-auto mb-16 bg-white rounded-lg shadow-xl overflow-hidden transform transition-all hover:scale-105 duration-300">
          <div className="p-8">
            <h3 className="text-3xl font-bold mb-6 text-[#4B6FEE] flex items-center justify-center">
              <Zap className="w-8 h-8 mr-2" aria-hidden="true" /> 
              Clear Insights in 5 Minutes
            </h3>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              Get a clear email summary plus detailed professional analysis - all in 5 minutes. 
              Stop wondering if your life insurance is working for you.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-gray-700 font-medium">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-2" aria-hidden="true" />
                <span>Crystal-clear email summary</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-2" aria-hidden="true" />
                <span>Professional PDF analysis</span>
              </div>
            </div>
            <p className="mt-6 text-xl font-semibold text-[#4B6FEE] flex items-center justify-center">
              <Upload className="w-6 h-6 mr-2" aria-hidden="true" />
              Just upload your in-force illustration to get started* (*Need an in-force illustration? Learn how to get one)
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-2xl font-semibold mb-8 text-[#4B6FEE]">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="bg-[#4B6FEE]/10 p-4 rounded-full mb-4">
                <Upload className="w-6 h-6 text-[#4B6FEE]" aria-hidden="true" />
              </div>
              <h4 className="text-lg font-semibold mb-2 text-[#4B6FEE]">Step 1: Get Ready</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>Request your illustration</li>
                <li>Takes about 2 weeks</li>
                <li>Step-by-step guidance</li>
              </ul>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-[#4B6FEE]/10 p-4 rounded-full mb-4">
                <Clock className="w-6 h-6 text-[#4B6FEE]" aria-hidden="true" />
              </div>
              <h4 className="text-lg font-semibold mb-2 text-[#4B6FEE]">Step 2: Upload & Analyze</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>Secure upload</li>
                <li>AI-powered analysis</li>
                <li>5-minute process</li>
              </ul>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-[#4B6FEE]/10 p-4 rounded-full mb-4">
                <FileText className="w-6 h-6 text-[#4B6FEE]" aria-hidden="true" />
              </div>
              <h4 className="text-lg font-semibold mb-2 text-[#4B6FEE]">Step 3: Get Results</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>Clear email summary</li>
                <li>Professional PDF report</li>
                <li>Instant delivery</li>
              </ul>
            </div>
          </div>
          <p className="text-gray-700 mt-8 text-base font-medium">
            That&apos;s it. No meetings, no sales calls. Just clear insights and professional analysis in 5 minutes.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-2xl font-semibold mb-8 text-[#4B6FEE]">What You&apos;ll Receive</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <h4 className="text-2xl font-semibold mb-6 text-center">Email Summary</h4>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 h-5 w-5" aria-hidden="true" />
                  <span className="text-lg">Current Coverage Assessment</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 h-5 w-5" aria-hidden="true" />
                  <span className="text-lg">Performance Highlights</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 h-5 w-5" aria-hidden="true" />
                  <span className="text-lg">Key Recommendations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 h-5 w-5" aria-hidden="true" />
                  <span className="text-lg">Clear Action Items</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-[#4B6FEE] hover:bg-[#3B4FDE] text-white font-medium py-4 rounded-lg flex items-center justify-center gap-2">
                <Link href="/sample-report">
                  <FileText className="w-5 h-5" aria-hidden="true" /> View Sample Summary
                </Link>
              </Button>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <h4 className="text-2xl font-semibold mb-6 text-center">Professional Analysis PDF</h4>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 h-5 w-5" aria-hidden="true" />
                  <span className="text-lg">Detailed Performance Metrics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 h-5 w-5" aria-hidden="true" />
                  <span className="text-lg">Coverage Optimization Options</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 h-5 w-5" aria-hidden="true" />
                  <span className="text-lg">Professional Recommendations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 h-5 w-5" aria-hidden="true" />
                  <span className="text-lg">Advisor-Ready Format</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-[#4B6FEE] hover:bg-[#3B4FDE] text-white font-medium py-4 rounded-lg flex items-center justify-center gap-2">
                <Link href="/sample-action-plan">
                  <FileText className="w-5 h-5" aria-hidden="true" /> View Sample Analysis
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden transform transition-all hover:scale-105 duration-300">
            <div className="bg-[#4B6FEE] text-white p-6">
              <h3 className="text-3xl font-bold mb-2 flex items-center justify-center">
                <Zap className="w-8 h-8 mr-2" aria-hidden="true" />
                Get Life Insurance Clarity Today
              </h3>
              <p className="text-xl">From confusion to confidence in 5 minutes</p>
            </div>
            <div className="p-8">
              <div className="flex justify-center mt-8">
                <Button asChild className="bg-[#22C55E] text-white hover:bg-[#16A34A] text-lg px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center">
                  <Link href="/upload">
                    Analyze My Policy
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

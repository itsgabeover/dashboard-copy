'use client'

import { Upload, Clock, FileText, CheckCircle, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0] py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#4B6FEE] mb-4 tracking-tight">
          Life Insurance Policy Reviews<br />
          <span className="text-4xl md:text-5xl lg:text-6xl">in 5 Minutes</span>
        </h1>
        <h2 className="text-2xl md:text-3xl mb-12 text-gray-600 font-light">
          AI-Powered Analysis for Financial Advisors
        </h2>
        
        <div className="max-w-4xl mx-auto mb-16 bg-white rounded-lg shadow-xl overflow-hidden transform transition-all hover:scale-105 duration-300">
          <div className="p-8">
            <h3 className="text-3xl font-bold mb-6 text-[#4B6FEE] flex items-center justify-center">
              <Zap className="w-8 h-8 mr-2" aria-hidden="true" /> 
              Transform Your Policy Review Process
            </h3>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              Make life insurance policy reviews a seamless part of your practice. Just like investment portfolio reviews, 
              regular life insurance policy analysis helps you deliver ongoing value to clients while identifying optimization opportunities.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-gray-700 font-medium">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-2" aria-hidden="true" />
                <span>No complex software to learn</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-2" aria-hidden="true" />
                <span>No lengthy analysis to perform</span>
              </div>
            </div>
            <p className="mt-6 text-xl font-semibold text-[#4B6FEE] flex items-center justify-center">
              <Upload className="w-6 h-6 mr-2" aria-hidden="true" />
              Simply upload any in-force illustration and let our AI handle the rest
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
              <h4 className="text-lg font-semibold mb-2 text-[#4B6FEE]">Upload Illustration</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>Drop your in-force illustration</li>
                <li>Add your email</li>
              </ul>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-[#4B6FEE]/10 p-4 rounded-full mb-4">
                <Clock className="w-6 h-6 text-[#4B6FEE]" aria-hidden="true" />
              </div>
              <h4 className="text-lg font-semibold mb-2 text-[#4B6FEE]">AI Analysis (5 Minutes)</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>Advanced policy review</li>
                <li>Comprehensive metrics analysis</li>
                <li>Risk assessment</li>
              </ul>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-[#4B6FEE]/10 p-4 rounded-full mb-4">
                <FileText className="w-6 h-6 text-[#4B6FEE]" aria-hidden="true" />
              </div>
              <h4 className="text-lg font-semibold mb-2 text-[#4B6FEE]">Receive Reports</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>Technical summary for you</li>
                <li>Professional client letter</li>
                <li>Both delivered to your inbox</li>
              </ul>
            </div>
          </div>
          <p className="text-gray-700 mt-8 text-base font-medium">
            That&apos;s it. No questionnaires, no extra steps. Just upload and get your analysis in 5 minutes.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-2xl font-semibold mb-8 text-[#4B6FEE]">What You&apos;ll Receive</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <h4 className="text-2xl font-semibold mb-6 text-center">Policy Review Advisor Analysis</h4>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 h-5 w-5" aria-hidden="true" />
                  <span className="text-lg">Advisor Report</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 h-5 w-5" aria-hidden="true" />
                  <span className="text-lg">Comprehensive Policy Review</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 h-5 w-5" aria-hidden="true" />
                  <span className="text-lg">Action Items</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 h-5 w-5" aria-hidden="true" />
                  <span className="text-lg">Performance Metrics</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-[#4B6FEE] hover:bg-[#3B4FDE] text-white font-medium py-4 rounded-lg flex items-center justify-center gap-2">
                <Link href="/sample-advisor-report">
                  <FileText className="w-5 h-5" aria-hidden="true" /> Download Sample Report
                </Link>
              </Button>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <h4 className="text-2xl font-semibold mb-6 text-center">Policy Review Client Summary</h4>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 h-5 w-5" aria-hidden="true" />
                  <span className="text-lg">Client Report</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 h-5 w-5" aria-hidden="true" />
                  <span className="text-lg">Clear Explanations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 h-5 w-5" aria-hidden="true" />
                  <span className="text-lg">Key Findings</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3 h-5 w-5" aria-hidden="true" />
                  <span className="text-lg">Next Steps</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-[#4B6FEE] hover:bg-[#3B4FDE] text-white font-medium py-4 rounded-lg flex items-center justify-center gap-2">
                <Link href="/sample-client-report">
                  <FileText className="w-5 h-5" aria-hidden="true" /> Download Sample Report
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
                Ready to Transform Your Policy Reviews?
              </h3>
              <p className="text-xl">Upload an in-force illustration and receive both reports within 5 minutes</p>
            </div>
            <div className="p-8">
              <div className="flex justify-center mt-8">
                <Button asChild className="bg-[#22C55E] text-white hover:bg-[#16A34A] text-lg px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center">
                  <Link href="/pre-payment-info">
                    Start Your Analysis
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

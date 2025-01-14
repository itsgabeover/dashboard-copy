'use client'

import { Zap, Shield, TrendingUp, Users, Clock, Brain, Upload, FileText, ArrowRight, AlertTriangle, CheckCircle, BarChart, Target, RefreshCw, XCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { SampleAnalysisReport } from '@/components/SampleAnalysisReport'
import Link from 'next/link'

const MissionPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0]">
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          {/* Hero Section */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-medium text-[#4B6FEE] mb-2">Why Check Your Policy?</h2>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-800 leading-tight">
              Your Life Insurance Needs<br />Regular Check-Ups Too
            </h1>
          </div>
          <h2 className="text-xl md:text-2xl mb-12 text-gray-600 font-normal">
            Like any financial plan, your life insurance needs care to stay healthy and protect your family
          </h2>

          {/* Feature Cards */}
          <div className="max-w-5xl mx-auto mb-16">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  icon: AlertTriangle, 
                  title: "Warning Signs", 
                  items: [
                    "Premium costs rising unexpectedly",
                    "Coverage that might end too soon",
                    "Policy expenses eating into value"
                  ]
                },
                { 
                  icon: TrendingUp, 
                  title: "Performance Checks", 
                  items: [
                    "Returns lower than promised",
                    "Cash value growing too slowly",
                    "Policy not meeting expectations"
                  ]
                },
                { 
                  icon: Shield, 
                  title: "Protection Updates", 
                  items: [
                    "Family needs have changed",
                    "Coverage may need adjusting",
                    "Better options now available"
                  ]
                },
              ].map((section, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg duration-300">
                  <div className="bg-[#4B6FEE] p-4">
                    <section.icon className="w-10 h-10 text-white mx-auto" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-medium mb-4 text-[#4B6FEE]">{section.title}</h3>
                    <ul className="text-left text-gray-600 space-y-2">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-1" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Features Section */}
          <div className="max-w-5xl mx-auto mb-16 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-[#4B6FEE] text-white p-6">
              <h3 className="text-2xl font-medium mb-2 flex items-center justify-center">
                <Brain className="w-8 h-8 mr-3" />
                Taking Care of Your Family&apos;s Protection
              </h3>
            </div>
            <div className="p-8">
              <div className="text-gray-700 mb-8 space-y-4">
                <p className="text-lg leading-relaxed">
                  Just like checking your retirement accounts, reviewing your life insurance helps ensure your family&apos;s protection stays strong. Regular check-ups catch problems early, before they put your coverage at risk.
                </p>
                <p className="font-medium text-[#4B6FEE] text-xl">What we check in every review:</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { 
                    icon: RefreshCw, 
                    title: "Life Changes",
                    text: "Update protection as your family grows"
                  },
                  { 
                    icon: Target, 
                    title: "Coverage Check",
                    text: "Make sure protection matches needs"
                  },
                  { 
                    icon: BarChart, 
                    title: "Cost Review",
                    text: "Keep premiums affordable long-term"
                  },
                  { 
                    icon: TrendingUp, 
                    title: "Growth Check",
                    text: "See if your policy is growing right"
                  },
                  { 
                    icon: Users, 
                    title: "Value Review",
                    text: "Make sure you&apos;re not overpaying"
                  },
                  { 
                    icon: AlertTriangle, 
                    title: "Loan Impact",
                    text: "Understand how loans affect coverage"
                  },
                  { 
                    icon: CheckCircle, 
                    title: "Tax Review",
                    text: "Keep your benefits tax-efficient"
                  },
                  { 
                    icon: FileText, 
                    title: "Health Report",
                    text: "Get a clear picture of policy status"
                  }
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-start bg-gray-50 rounded-lg p-4 transition-all hover:bg-gray-100 duration-300"
                  >
                    <item.icon className="w-6 h-6 text-[#4B6FEE] mr-4 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-700">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comparison Section */}
          <div className="max-w-5xl mx-auto mb-16">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Challenge Card */}
              <div className="bg-white rounded-xl p-8 text-left border-2 border-red-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-red-50 p-3 rounded-full">
                    <XCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <h4 className="text-2xl font-semibold text-gray-900">Why It&apos;s Hard to Do Alone</h4>
                </div>
                <div className="space-y-6">
                  <p className="text-lg text-gray-700 border-l-4 border-red-200 pl-4">
                    Most people don&apos;t know what to check:
                  </p>
                  <ul className="space-y-4">
                    {[
                      {
                        title: "Complex Documents",
                        description: "Insurance policies are hard to understand"
                      },
                      {
                        title: "Hidden Problems",
                        description: "Issues aren&apos;t obvious until it&apos;s too late"
                      },
                      {
                        title: "Time-Consuming",
                        description: "Traditional reviews take weeks to complete"
                      },
                      {
                        title: "Confusing Results",
                        description: "Hard to know what needs attention"
                      }
                    ].map((item, i) => (
                      <li key={i} className="flex items-start bg-red-50/50 rounded-lg p-3 hover:bg-red-50 transition-all duration-300">
                        <CheckCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-1" />
                        <div>
                          <span className="font-medium text-gray-900">{item.title}</span>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Solution Card */}
              <div className="bg-white rounded-xl p-8 text-left border-2 border-green-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-green-50 p-3 rounded-full">
                    <Zap className="w-8 h-8 text-green-500" />
                  </div>
                  <h4 className="text-2xl font-semibold text-gray-900">How We Make It Easy</h4>
                </div>
                <div className="space-y-6">
                  <p className="text-lg text-gray-700 border-l-4 border-green-200 pl-4">
                    Get clear answers in minutes:
                  </p>
                  <ul className="space-y-4">
                    {[
                      {
                        title: "Quick Check-Up",
                        description: "Just upload your policy statement"
                      },
                      {
                        title: "Simple Answers",
                        description: "Learn exactly what&apos;s working and what isn&apos;t"
                      },
                      {
                        title: "Clear Reports",
                        description: "One simple summary, one for your advisor"
                      },
                      {
                        title: "Fast Results",
                        description: "Complete review in just 5 minutes"
                      }
                    ].map((item, i) => (
                      <li key={i} className="flex items-start bg-green-50/50 rounded-lg p-3 hover:bg-green-50 transition-all duration-300">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                        <div>
                          <span className="font-medium text-gray-900">{item.title}</span>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Process Steps */}
          <div className="max-w-5xl mx-auto mb-24 pt-8">
            <h3 className="text-4xl md:text-5xl font-medium mb-4 text-[#4B6FEE]">How It Works</h3>
            <p className="text-xl text-gray-600 mb-16">
              Three simple steps to check your policy:
            </p>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center">
                <div className="bg-[#4B6FEE]/10 p-6 rounded-full mb-6 transform transition-all hover:scale-110 duration-300">
                  <Upload className="w-12 h-12 text-[#4B6FEE]" />
                </div>
                <h5 className="text-2xl font-medium mb-4 text-[#4B6FEE]">1. Share Your Policy</h5>
                <ul className="text-gray-600 text-lg space-y-2">
                  <li>Upload your latest statement</li>
                  <li>Quick and secure</li>
                </ul>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-[#4B6FEE]/10 p-6 rounded-full mb-6 transform transition-all hover:scale-110 duration-300">
                  <Clock className="w-12 h-12 text-[#4B6FEE]" />
                </div>
                <h5 className="text-2xl font-medium mb-4 text-[#4B6FEE]">2. Quick Review</h5>
                <ul className="text-gray-600 text-lg space-y-2">
                  <li>Thorough analysis</li>
                  <li>Check all key areas</li>
                  <li>Find any issues</li>
                </ul>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-[#4B6FEE]/10 p-6 rounded-full mb-6 transform transition-all hover:scale-110 duration-300">
                  <FileText className="w-12 h-12 text-[#4B6FEE]" />
                </div>
                <h5 className="text-2xl font-medium mb-4 text-[#4B6FEE]">3. Get Answers</h5>
                <ul className="text-gray-600 text-lg space-y-2">
                  <li>Clear explanation</li>
                  <li>Simple next steps</li>
                  <li>Expert guidance</li>
                </ul>
              </div>
            </div>

            <p className="text-gray-600 mt-12 text-xl font-normal max-w-3xl mx-auto">
              Start your policy check-up now - it only takes 5 minutes to get answers.
            </p>

            {/* Sample Reports */}
            <div className="max-w-4xl mx-auto mt-16">
              <h4 className="text-2xl font-medium mb-8 text-[#4B6FEE]">Sample Reports</h4>
              <div className="grid md:grid-cols-2 gap-8">
                <SampleAnalysisReport 
                  title="Your Policy Check-Up"
                  items={[
                    "Easy to understand",
                    "Clear findings",
                    "Simple next steps",
                    "Key numbers explained"
                  ]}
                  reportUrl="https://phw1ruho25yy63z9.public.blob.vercel-storage.com/SAMPLE%20ANALYSIS-KcNItO6ThA29F15Sa0kuWc4uySibb9.pdf"
                />
                <SampleAnalysisReport 
                  title="Advisor Details"
                  items={[
                    "Technical analysis",
                    "Detailed metrics",
                    "Specific recommendations",
                    "Professional summary"
                  ]}
                  reportUrl="https://phw1ruho25yy63z9.public.blob.vercel-storage.com/SAMPLE%20SUMMARY-gN6m36r8cHAwdzi68E4adsDuqypPMT.pdf"
                />
              </div>
            </div>

            {/* Call to Action */}
            <div className="max-w-4xl mx-auto mt-16 flex justify-center space-x-6">
              <Button 
                asChild 
                className="bg-[#22C55E] hover:bg-[#16A34A] text-white text-xl px-12 py-6 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto"
              >
                <Link href="/upload">
                  Check Your Policy Now
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default MissionPage

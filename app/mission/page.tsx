import { Zap, Shield, TrendingUp, Users, Clock, Brain, Upload, FileText, ArrowRight, AlertTriangle, CheckCircle, BarChart, Target, RefreshCw, XCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { SampleAnalysisReport } from '@/components/SampleAnalysisReport'

export default function MissionPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0]">
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-medium text-[#4B6FEE] mb-2"></h2>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-800 leading-tight">
              Why Your Life Insurance<br />Needs Regular Check-ups
            </h1>
          </div>
          <h2 className="text-xl md:text-2xl mb-12 text-gray-600 font-normal">
            Just like you monitor your investments, your life insurance policy needs regular review to stay on track
          </h2>

          <div className="max-w-5xl mx-auto mb-16">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  icon: AlertTriangle, 
                  title: "Policy Risks", 
                  items: [
                    "Premiums may not be enough to maintain coverage",
                    "Policy guarantees could expire unexpectedly",
                    "Insurance costs can increase over time"
                  ]
                },
                { 
                  icon: TrendingUp, 
                  title: "Performance Impacts", 
                  items: [
                    "Returns may be lower than expected",
                    "Savings value can fluctuate",
                    "Actual results may differ from projections"
                  ]
                },
                { 
                  icon: Shield, 
                  title: "Purpose & Design", 
                  items: [
                    "Your needs may have changed",
                    "Protection amount may need updating",
                    "Policy features might need adjustment"
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

          <div className="max-w-5xl mx-auto mb-16 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-[#4B6FEE] text-white p-6">
              <h3 className="text-2xl font-medium mb-2 flex items-center justify-center">
                <Brain className="w-8 h-8 mr-3" />
                Smart Policy Management
              </h3>
            </div>
            <div className="p-8">
              <div className="text-gray-700 mb-8">
                <p className="text-lg leading-relaxed">
                  Just as you review your 401(k) or investment accounts regularly, your life insurance needs periodic check-ups to ensure it&apos;s performing as expected and meeting your family&apos;s needs. Regular reviews help catch issues early, just like monitoring your investment portfolio.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { 
                    icon: RefreshCw, 
                    title: "Life Changes",
                    text: "How your policy fits your current situation"
                  },
                  { 
                    icon: Target, 
                    title: "Coverage Review",
                    text: "Is your protection amount still right?"
                  },
                  { 
                    icon: BarChart, 
                    title: "Premium Check",
                    text: "Are your payments keeping the policy healthy?"
                  },
                  { 
                    icon: TrendingUp, 
                    title: "Performance Review",
                    text: "How your policy is actually performing"
                  },
                  { 
                    icon: Users, 
                    title: "Cost Review",
                    text: "Are you paying more than necessary?"
                  },
                  { 
                    icon: AlertTriangle, 
                    title: "Policy Loans",
                    text: "Impact on your benefits and values"
                  },
                  { 
                    icon: CheckCircle, 
                    title: "Tax Review",
                    text: "Important tax considerations"
                  },
                  { 
                    icon: FileText, 
                    title: "Documentation",
                    text: "Keeping track of policy status"
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

          <div className="max-w-5xl mx-auto mb-16">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-8 text-left border-2 border-red-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-red-50 p-3 rounded-full">
                    <XCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <h4 className="text-2xl font-semibold text-gray-900">The Problem</h4>
                </div>
                <div className="space-y-6">
                  <p className="text-lg text-gray-700 border-l-4 border-red-200 pl-4">
                    Traditional life insurance reviews are complicated:
                  </p>
                  <ul className="space-y-4">
                    {[
                      {
                        title: "Time-Consuming",
                        description: "Hours reading complex documents"
                      },
                      {
                        title: "Confusing Terms",
                        description: "Technical language you shouldn&apos;t need to understand"
                      },
                      {
                        title: "Complex Process",
                        description: "Difficult to get straight answers"
                      },
                      {
                        title: "Inconsistent Information",
                        description: "Hard to know what matters"
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

              <div className="bg-white rounded-xl p-8 text-left border-2 border-green-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-green-50 p-3 rounded-full">
                    <Zap className="w-8 h-8 text-green-500" />
                  </div>
                  <h4 className="text-2xl font-semibold text-gray-900">The IP-AI Solution</h4>
                </div>
                <div className="space-y-6">
                  <p className="text-lg text-gray-700 border-l-4 border-green-200 pl-4">
                    Get answers about your policy in 5 minutes:
                  </p>
                  <ul className="space-y-4">
                    {[
                      {
                        title: "Quick Analysis",
                        description: "Understand your policy instantly"
                      },
                      {
                        title: "Simple Answers",
                        description: "Know exactly what you have"
                      },
                      {
                        title: "Professional Reports",
                        description: "Get both summary and detailed analysis"
                      },
                      {
                        title: "Easy Process",
                        description: "No meetings or complicated forms"
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

          <div className="max-w-5xl mx-auto mb-24 pt-8">
            <h3 className="text-4xl md:text-5xl font-medium mb-4 text-[#4B6FEE]">How It Works</h3>
            <p className="text-xl text-gray-600 mb-16">
              Get answers about your policy in three easy steps:
            </p>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center">
                <div className="bg-[#4B6FEE]/10 p-6 rounded-full mb-6 transform transition-all hover:scale-110 duration-300">
                  <Upload className="w-12 h-12 text-[#4B6FEE]" />
                </div>
                <h5 className="text-2xl font-medium mb-4 text-[#4B6FEE]">Upload Your Policy</h5>
                <ul className="text-gray-600 text-lg space-y-2">
                  <li>Share your illustration</li>
                  <li>Add your email</li>
                </ul>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-[#4B6FEE]/10 p-6 rounded-full mb-6 transform transition-all hover:scale-110 duration-300">
                  <Clock className="w-12 h-12 text-[#4B6FEE]" />
                </div>
                <h5 className="text-2xl font-medium mb-4 text-[#4B6FEE]">5-Minute Analysis</h5>
                <ul className="text-gray-600 text-lg space-y-2">
                  <li>AI reviews everything</li>
                  <li>Checks all important details</li>
                  <li>Spots potential issues</li>
                </ul>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-[#4B6FEE]/10 p-6 rounded-full mb-6 transform transition-all hover:scale-110 duration-300">
                  <FileText className="w-12 h-12 text-[#4B6FEE]" />
                </div>
                <h5 className="text-2xl font-medium mb-4 text-[#4B6FEE]">Get Your Results</h5>
                <ul className="text-gray-600 text-lg space-y-2">
                  <li>Easy-to-read email summary</li>
                  <li>Professional PDF report</li>
                  <li>Instant delivery</li>
                </ul>
              </div>
            </div>

            <p className="text-gray-600 mt-12 text-xl font-normal max-w-3xl mx-auto">
              That&apos;s it. No questionnaires, no meetings. Just answers in 5 minutes.
            </p>

            <div className="max-w-4xl mx-auto mt-16">
              <h4 className="text-2xl font-medium mb-8 text-[#4B6FEE]">Sample Reports</h4>
              <div className="grid md:grid-cols-2 gap-8">
                <SampleAnalysisReport 
                  title="Professional Analysis PDF"
                  items={[
                    "Comprehensive Review",
                    "Detailed Analysis",
                    "Key Findings",
                    "Expert Insights"
                  ]}
                  reportUrl="https://phw1ruho25yy63z9.public.blob.vercel-storage.com/SAMPLE%20ANALYSIS-KcNItO6ThA29F15Sa0kuWc4uySibb9.pdf"
                />
                <SampleAnalysisReport 
                  title="Email Summary"
                  items={[
                    "Simple Explanations",
                    "Important Highlights",
                    "Next Steps",
                    "Clear Actions"
                  ]}
                  reportUrl="https://phw1ruho25yy63z9.public.blob.vercel-storage.com/SAMPLE%20SUMMARY-gN6m36r8cHAwdzi68E4adsDuqypPMT.pdf"
                />
              </div>
            </div>

            <div className="max-w-4xl mx-auto mt-16 flex justify-center space-x-6">
              <Button 
                asChild 
                className="bg-[#22C55E] hover:bg-[#16A34A] text-white text-xl px-12 py-6 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto"
              >
                <a href="/pre-payment-info">
                  Analyze My Policy
                  <ArrowRight className="w-6 h-6" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

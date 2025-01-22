"use client"

import {
  Upload,
  FileText,
  CheckCircle,
  Zap,
  ArrowRight,
  Shield,
  Sparkles,
  TrendingUp,
  Lock,
  HelpCircle,
  LineChart,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { FC } from "react"

export const Hero: FC = () => {
  const router = useRouter()

  const handleViewSample = (pdfUrl: string) => {
    router.push(`/view-pdf?pdfUrl=/${pdfUrl}`)
  }

  const scrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId)
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="w-full relative" aria-labelledby="hero-title">
      {/* Advisor Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 text-blue-700 py-2 px-4 text-center border-b border-blue-100/50">
        <Link
          href="/advisor-demo"
          className="text-base font-medium hover:underline inline-flex items-center gap-2 transition-colors hover:text-blue-800"
        >
          Financial Advisor? Schedule a Demo <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-blue-100/50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-6 text-center max-w-4xl mx-auto">
            <h1
              id="hero-title"
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#4B6FEE] mb-4 tracking-tight flex flex-col items-center"
            >
              <span className="mb-2">Life Insurance</span>
              <span className="flex items-center gap-2">
                <span className="text-3xl md:text-5xl lg:text-6xl opacity-90">Policy Reviews</span>
                <span className="bg-gradient-to-r from-[#4B6FEE] to-blue-500 text-white text-lg md:text-xl lg:text-2xl px-4 py-1 rounded-full transform -rotate-2 shadow-md font-normal">
                  in minutes
                </span>
              </span>
            </h1>
            <h2 className="text-xl md:text-3xl mb-12 text-gray-600 font-light">
              AI-Powered Life Insurance Policy Analysis
            </h2>
            <Card className="w-full bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border-blue-100">
              <CardContent className="p-8">
                <div className="flex flex-col items-center space-y-6">
                  <div className="rounded-full bg-blue-50 p-3">
                    <Zap className="w-8 h-8 text-[#4B6FEE]" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#4B6FEE]">
                    From Illustration to Impact in Minutes
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed max-w-2xl">
                    Get clarity on how your policy supports your financial planning – our AI turns complex illustrations
                    into confident decisions that drive your strategy.
                  </p>
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-gray-700 font-medium">
                    <div className="flex items-center">
                      <CheckCircle className="w-6 h-6 text-green-500 mr-2" aria-hidden="true" />
                      <span>No questionnaires needed</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-6 h-6 text-green-500 mr-2" aria-hidden="true" />
                      <span>No back-and-forth delays</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => scrollToSection("how-it-works")}
                    className="mt-4 bg-[#4B6FEE] hover:bg-blue-700 text-white px-8 py-6 rounded-full text-lg font-semibold transition-all duration-300 hover:transform hover:scale-105"
                  >
                    <HelpCircle className="w-6 h-6 mr-2" aria-hidden="true" />
                    How it works
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-24 bg-white relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-[#4B6FEE]">How It Works</h2>
              <p className="text-gray-600 text-lg">Three simple steps to understand your policy</p>
            </div>

            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 transform -translate-y-1/2 hidden md:block"></div>
              <div className="grid md:grid-cols-3 gap-8 relative z-10">
                {[
                  {
                    step: 1,
                    title: "Get Your Illustration",
                    description: "Request an in-force policy illustration from your insurer.",
                    icon: <FileText className="w-6 h-6" />,
                  },
                  {
                    step: 2,
                    title: "Upload & Analyze",
                    description: "Upload your illustration and our AI analyzes it in minutes.",
                    icon: <Upload className="w-6 h-6" />,
                  },
                  {
                    step: 3,
                    title: "Get Your Results",
                    description: "Receive your email summary and detailed PDF report.",
                    icon: <Zap className="w-6 h-6" />,
                  },
                ].map((item) => (
                  <Card
                    key={item.step}
                    className="text-center transition-all duration-300 hover:shadow-lg bg-white group hover:-translate-y-1"
                  >
                    <CardContent className="p-6">
                      <div className="bg-blue-50 text-[#4B6FEE] rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center text-xl font-bold group-hover:bg-[#4B6FEE] group-hover:text-white transition-colors duration-300">
                        {item.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-[#4B6FEE]">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="mt-16 flex flex-col items-center space-y-8">
              <Button
                onClick={() => scrollToSection("ai-analysis")}
                className="bg-[#4B6FEE] hover:bg-blue-700 text-white px-8 py-6 rounded-full text-lg font-semibold group transition-all duration-300 hover:transform hover:scale-105"
              >
                <LineChart className="w-6 h-6 mr-2 group-hover:animate-pulse" aria-hidden="true" />
                Explore AI Analysis
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div id="ai-analysis" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-[#4B6FEE]">What Our AI Analysis Reveals</h2>
              <p className="text-gray-600 text-lg">Comprehensive insights for informed decisions</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: <Shield className="h-8 w-8" />,
                  title: "Protection Confidence",
                  description:
                    "Understand exactly how your coverage aligns with your family's needs and get clarity on your policy's true protection power",
                },
                {
                  icon: <Sparkles className="h-8 w-8" />,
                  title: "Premium Strategy",
                  description:
                    "See if your premium structure is optimized and learn how to maintain your coverage efficiently over time",
                },
                {
                  icon: <TrendingUp className="h-8 w-8" />,
                  title: "Growth Analysis",
                  description:
                    "Get clear insights into your policy's accumulation potential and understand your options for accessing benefits",
                },
                {
                  icon: <Lock className="h-8 w-8" />,
                  title: "Policy Security",
                  description:
                    "Review your policy guarantees and discover strategies to keep your coverage strong for the long term",
                },
              ].map((item, index) => (
                <Card
                  key={index}
                  className="group transition-all duration-300 hover:shadow-lg bg-white transform hover:scale-102"
                >
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="p-2 rounded-full bg-blue-50 group-hover:bg-[#4B6FEE] transition-colors duration-300">
                      <div className="text-[#4B6FEE] group-hover:text-white transition-colors duration-300">
                        {item.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-12">
              <Button
                onClick={() => scrollToSection("sample-reports")}
                className="bg-[#4B6FEE] hover:bg-blue-700 text-white px-8 py-6 rounded-full text-lg font-semibold group transition-all duration-300 hover:transform hover:scale-105"
              >
                <FileText className="w-6 h-6 mr-2 group-hover:animate-pulse" aria-hidden="true" />
                Sample Reports
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Combined Sample Reports and CTA Section */}
      <div id="sample-reports" className="py-24 bg-white relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-16">
            {/* Sample Reports */}
            <div>
              <div className="text-center mb-12 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-[#4B6FEE]">Your AI Analysis Package</h2>
                <p className="text-gray-600 text-lg">Comprehensive reports tailored to your needs</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    title: "Clear Email Summary",
                    features: [
                      "Current coverage snapshot",
                      "Key performance insights",
                      "Strategic recommendations",
                      "Action steps explained",
                    ],
                    sample: "sample_reports/SAMPLE_CLIENT_SUMMARY.pdf",
                  },
                  {
                    title: "Professional PDF Report",
                    features: [
                      "In-depth policy analysis",
                      "Optimization strategies",
                      "Clear recommendations",
                      "Advisor-ready details",
                    ],
                    sample: "sample_reports/SAMPLE_POLICY_REVIEW.pdf",
                  },
                ].map((item, index) => (
                  <Card
                    key={index}
                    className="group transition-all duration-300 hover:shadow-xl bg-white hover:-translate-y-1 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent rounded-lg" />
                    <CardHeader className="relative pb-0">
                      <div className="flex items-center justify-center mb-6">
                        <div className="rounded-full bg-blue-50 p-3 group-hover:bg-[#4B6FEE] transition-colors duration-300">
                          <FileText className="h-6 w-6 text-[#4B6FEE] group-hover:text-white transition-colors duration-300" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-semibold text-center text-gray-900">{item.title}</h3>
                    </CardHeader>
                    <CardContent className="relative pt-6">
                      <ul className="space-y-4">
                        {item.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-3 group/item">
                            <div className="flex-shrink-0 rounded-full p-1 transition-colors duration-300 group-hover/item:bg-green-50">
                              <CheckCircle className="text-green-500 h-5 w-5" />
                            </div>
                            <span className="text-gray-600 transition-colors duration-300 group-hover/item:text-gray-900">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        onClick={() => handleViewSample(item.sample)}
                        className="w-full mt-8 bg-[#4B6FEE] hover:bg-blue-600 text-white transition-all duration-300 group-hover:transform group-hover:scale-102"
                      >
                        <FileText className="w-5 h-5 mr-2" />
                        View Sample
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* CTA Card */}
            <Card className="border-2 border-blue-100 bg-white transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
              <CardHeader className="text-center bg-gradient-to-r from-[#4B6FEE] to-blue-500 text-white p-8">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="rounded-full bg-white/10 p-2 transition-transform duration-300 group-hover:scale-110">
                    <Zap className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">Get Your Policy Analysis Now</h2>
                </div>
                <p className="text-xl text-blue-100">From questions to clarity in minutes</p>
              </CardHeader>
              <CardContent className="flex justify-center p-8 bg-gradient-to-b from-white to-blue-50/30">
                <Button
                  asChild
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Link href="/upload" className="flex items-center gap-2">
                    Start My Analysis
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero


"use client"

import { Upload, FileText, CheckCircle, Zap, ArrowRight, Shield, Sparkles, TrendingUp, Lock } from "lucide-react"
import Image from "next/image"
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

  return (
         <section className="w-full" aria-labelledby="hero-title">
        {/* Hero Section */}
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-blue-100/50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center space-y-6 text-center max-w-4xl mx-auto">
              <h1
                id="hero-title"
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#4B6FEE] mb-4 tracking-tight"
              >
                Life Insurance Policy Reviews
                <br />
                <span className="text-3xl md:text-5xl lg:text-6xl">in Minutes</span>
              </h1>
              <h2 className="text-xl md:text-3xl mb-12 text-gray-600 font-light">AI-Powered Life Insurance Analysis</h2>
              <Card className="w-full bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <h3 className="text-2xl md:text-3xl font-bold mb-6 text-[#4B6FEE] flex items-center justify-center">
                    <Zap className="w-8 h-8 mr-2" aria-hidden="true" />
                    From Illustration to Impact in Minutes
                  </h3>
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed max-w-2xl mx-auto">
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
                    asChild
                    className="mt-8 bg-[#4B6FEE] hover:bg-blue-700 text-white px-8 py-6 rounded-full text-lg font-semibold"
                  >
                    <Link href="/upload" className="flex items-center gap-2">
                      <Upload className="w-6 h-6" aria-hidden="true" />
                      Upload your illustration now
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-[#4B6FEE] mb-12">
                What Our AI Analysis Reveals
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    icon: <Shield className="h-8 w-8 text-[#4B6FEE]" />,
                    title: "Protection Confidence",
                    description:
                      "Understand exactly how your coverage aligns with your family's needs and get clarity on your policy's true protection power",
                  },
                  {
                    icon: <Sparkles className="h-8 w-8 text-[#4B6FEE]" />,
                    title: "Premium Strategy",
                    description:
                      "See if your premium structure is optimized and learn how to maintain your coverage efficiently over time",
                  },
                  {
                    icon: <TrendingUp className="h-8 w-8 text-[#4B6FEE]" />,
                    title: "Growth Analysis",
                    description:
                      "Get clear insights into your policy's accumulation potential and understand your options for accessing benefits",
                  },
                  {
                    icon: <Lock className="h-8 w-8 text-[#4B6FEE]" />,
                    title: "Policy Security",
                    description:
                      "Review your policy guarantees and discover strategies to keep your coverage strong for the long term",
                  },
                ].map((item, index) => (
                  <Card
                    key={index}
                    className="transition-all hover:shadow-lg bg-white transform hover:scale-105 duration-300"
                  >
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      {item.icon}
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-[#4B6FEE] mb-12">How It Works</h2>
              <div className="relative">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-200 transform -translate-y-1/2 hidden md:block"></div>
                <div className="grid md:grid-cols-3 gap-8 relative z-10">
                  {[
                    {
                      step: 1,
                      title: "Get Your Illustration",
                      description: "Request a current policy illustration from your insurer. Takes about a week.",
                    },
                    {
                      step: 2,
                      title: "Upload & Analyze",
                      description: "Upload your illustration and our AI analyzes it in minutes.",
                    },
                    {
                      step: 3,
                      title: "Get Your Results",
                      description: "Receive your email summary and detailed PDF report instantly.",
                    },
                  ].map((item) => (
                    <Card key={item.step} className="text-center transition-all hover:shadow-lg bg-white">
                      <CardContent className="pt-6">
                        <div className="bg-[#4B6FEE] text-white rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                          {item.step}
                        </div>
                        <h3 className="text-xl font-semibold mb-4 text-[#4B6FEE]">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Package Section */}
        <div className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-[#4B6FEE] mb-12">
                Your Analysis Package Includes:
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="transition-all hover:shadow-lg bg-white">
                  <CardHeader>
                    <h3 className="text-2xl font-semibold text-center">Clear Email Summary</h3>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {[
                        "Current coverage snapshot",
                        "Key performance insights",
                        "Strategic recommendations",
                        "Action steps explained",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-3">
                          <CheckCircle className="text-green-500 h-5 w-5 flex-shrink-0" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => handleViewSample("sample_reports/SAMPLE_CLIENT_SUMMARY.pdf")}
                      className="w-full mt-8"
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      View Sample
                    </Button>
                  </CardContent>
                </Card>

                <Card className="transition-all hover:shadow-lg bg-white">
                  <CardHeader>
                    <h3 className="text-2xl font-semibold text-center">Professional PDF Report</h3>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {[
                        "In-depth policy analysis",
                        "Optimization strategies",
                        "Clear recommendations",
                        "Advisor-ready details",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-3">
                          <CheckCircle className="text-green-500 h-5 w-5 flex-shrink-0" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => handleViewSample("sample_reports/SAMPLE_POLICY_REVIEW.pdf")}
                      className="w-full mt-8"
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      View Sample
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-blue-100 bg-white">
                <CardHeader className="text-center bg-[#4B6FEE] text-white">
                  <div className="flex items-center justify-center gap-3">
                    <Zap className="w-8 h-8" />
                    <h2 className="text-2xl md:text-3xl font-bold">Get Your Policy Analysis Now</h2>
                  </div>
                  <p className="text-xl mt-2">From questions to clarity in minutes</p>
                </CardHeader>
                <CardContent className="flex justify-center p-8">
                  <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6 rounded-full">
                    <Link href="/upload" className="flex items-center gap-2">
                      Start My Analysis
                      <ArrowRight className="w-5 h-5" />
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


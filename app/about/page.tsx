"use client"

import {
  Zap,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Search,
  Lightbulb,
  ChevronRight,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { FC } from "react"

const AboutPage: FC = () => {
  return (
    <section className="w-full relative" aria-labelledby="about-title">
      {/* Advisor Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 text-blue-700 py-2 px-4 text-center border-b border-blue-100/50">
        <Link
          href="/advisor-demo"
          className="text-base font-medium hover:underline inline-flex items-center gap-2 transition-colors hover:text-blue-800"
        >
          Financial Advisor? Schedule a Demo <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-100/50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="flex flex-col items-center space-y-6 text-center max-w-4xl mx-auto mb-16">
            <h1
              id="about-title"
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#4B6FEE] mb-4 tracking-tight"
            >
              Every Life Insurance Policy Tells a Story. Are You Reading Yours?
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-light max-w-3xl">
              Your policy changes as your life changes. Behind the complex terms and numbers lies a powerful story of
              protection, growth, and security. Let&apos;s uncover it together.
            </p>
          </div>

          {/* Key Issues Section */}
          <div className="max-w-5xl mx-auto mb-24">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-[#4B6FEE]">Why Your Policy Needs a Deeper Look</h2>
              <p className="text-gray-600 text-lg">
                Your life insurance isn&apos;t static - it&apos;s a dynamic financial instrument that evolves over time.
                Small changes can have big impacts on your coverage and goals.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: AlertTriangle,
                  title: "Silent Threats",
                  items: ["Expiring guarantees", "Premium increases", "Coverage gaps"],
                },
                {
                  icon: TrendingUp,
                  title: "Hidden Value",
                  items: ["Growth opportunities", "Living benefits", "Tax advantages"],
                },
                {
                  icon: Shield,
                  title: "Future Ready",
                  items: ["Strategy alignment", "Guarantee status", "Protection updates"],
                },
              ].map((section, index) => (
                <Card
                  key={index}
                  className="group transition-all duration-300 hover:shadow-lg bg-white transform hover:scale-102"
                >
                  <CardHeader className="flex flex-col items-center pb-2">
                    <div className="rounded-full bg-blue-50 p-3 mb-4 group-hover:bg-[#4B6FEE] transition-colors duration-300">
                      <section.icon className="w-8 h-8 text-[#4B6FEE] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#4B6FEE]">{section.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-start group/item">
                          <div className="flex-shrink-0 rounded-full p-1 transition-colors duration-300 group-hover/item:bg-green-50">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </div>
                          <span className="text-gray-600 ml-2 transition-colors duration-300 group-hover/item:text-gray-900">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Enhanced Comparison Section */}
          <div className="max-w-5xl mx-auto mb-24">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-[#4B6FEE]">
                Traditional Review vs Insurance Planner AI
              </h2>
              <p className="text-gray-600 text-lg">
                See how our AI-powered analysis compares to traditional policy reviews
              </p>
            </div>
            <Card className="bg-white p-8 shadow-lg border-blue-100">
              <CardContent className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-[#4B6FEE] mb-4">Traditional Review</h3>
                  {[
                    {
                      icon: Clock,
                      title: "Hours reading complex documents",
                      description: "Time-consuming manual process",
                    },
                    {
                      icon: AlertTriangle,
                      title: "Key details often missed",
                      description: "Human limitations affect thoroughness",
                    },
                    { icon: FileText, title: "Basic policy summary", description: "Surface-level understanding" },
                  ].map((item, index) => (
                    <Card key={index} className="group transition-all duration-300 hover:shadow-md bg-gray-50">
                      <CardContent className="flex items-start gap-4 p-4">
                        <div className="rounded-full bg-blue-50 p-2 group-hover:bg-[#4B6FEE] transition-colors duration-300">
                          <item.icon className="w-6 h-6 text-[#4B6FEE] group-hover:text-white transition-colors duration-300" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-[#4B6FEE] mb-4">Insurance Planner AI</h3>
                  {[
                    { icon: Zap, title: "5-minute AI-powered analysis", description: "Fast, precise processing" },
                    { icon: Search, title: "Every feature examined", description: "Comprehensive digital review" },
                    {
                      icon: Lightbulb,
                      title: "Deep insights you can act on",
                      description: "Personalized recommendations",
                    },
                  ].map((item, index) => (
                    <Card key={index} className="group transition-all duration-300 hover:shadow-md bg-gray-50">
                      <CardContent className="flex items-start gap-4 p-4">
                        <div className="rounded-full bg-blue-50 p-2 group-hover:bg-[#4B6FEE] transition-colors duration-300">
                          <item.icon className="w-6 h-6 text-[#4B6FEE] group-hover:text-white transition-colors duration-300" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="max-w-4xl mx-auto mb-16">
            <Card className="border-2 border-blue-100 bg-white transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
              <CardHeader className="text-center bg-gradient-to-r from-[#4B6FEE] to-blue-500 text-white p-8">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="rounded-full bg-white/10 p-2 transition-transform duration-300 group-hover:scale-110">
                    <Zap className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">Get Clarity Now</h2>
                </div>
                <p className="text-xl text-blue-100">From complex policies to confident decisions in minutes</p>
              </CardHeader>
              <CardContent className="flex justify-center p-8 bg-gradient-to-b from-white to-blue-50/30">
                <Button
                  asChild
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Link href="/upload" className="flex items-center gap-2">
                    Analyze My Policy
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

export default AboutPage


"use client"

import { Zap, Shield, TrendingUp, AlertTriangle, CheckCircle, Clock, FileText, Search, Lightbulb } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { FC } from "react"

const AboutPage: FC = () => {
  return (
    <section className="w-full bg-gradient-to-b from-gray-100 to-blue-100/50">
      <div className="container mx-auto px-4 pt-16 md:pt-24 lg:pt-32">
        {/* Hero Section */}
        <div className="flex flex-col items-center space-y-6 text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#4B6FEE] max-w-4xl">
            Every Life Insurance Policy Tells a Story. Are You Reading Yours?
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl">
            Your policy changes as your life changes. Behind the complex terms and numbers lies a powerful story of
            protection, growth, and security. Let's uncover it together.
          </p>
        </div>

        {/* Key Issues Section */}
        <div className="max-w-5xl mx-auto mb-24">
          <h2 className="text-3xl font-bold text-center text-[#4B6FEE] mb-4">Why Your Policy Needs a Deeper Look</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Your life insurance isn't static - it's a dynamic financial instrument that evolves over time. Small changes
            can have big impacts on your coverage and goals.
          </p>
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
                className="transition-all hover:shadow-lg bg-white transform hover:scale-105 duration-300"
              >
                <CardHeader className="flex flex-col items-center pb-2">
                  <div className="bg-blue-100 rounded-full p-3 mb-4">
                    <section.icon className="w-8 h-8 text-[#4B6FEE]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#4B6FEE]">{section.title}</h3>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                        <span className="text-gray-600">{item}</span>
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
          <h2 className="text-3xl font-bold text-center text-[#4B6FEE] mb-12">
            Traditional Review vs Insurance Planner AI
          </h2>
          <Card className="bg-white p-8 shadow-lg">
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
                  <Card key={index} className="flex items-start gap-4 bg-gray-50 transition-all hover:shadow-md">
                    <CardContent className="flex items-start gap-4">
                      <item.icon className="w-6 h-6 text-[#4B6FEE] flex-shrink-0 mt-1" />
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
                  <Card key={index} className="flex items-start gap-4 bg-gray-50 transition-all hover:shadow-md">
                    <CardContent className="flex items-start gap-4">
                      <item.icon className="w-6 h-6 text-[#4B6FEE] flex-shrink-0 mt-1" />
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
          <Card className="border-2 border-blue-100 bg-white">
            <CardHeader className="text-center bg-[#4B6FEE] text-white">
              <div className="flex items-center justify-center gap-3">
                <Zap className="w-8 h-8" />
                <h2 className="text-2xl md:text-3xl font-bold">Get Clarity Now</h2>
              </div>
              <p className="text-xl mt-2">From complex policies to confident decisions in minutes</p>
            </CardHeader>
            <CardContent className="flex justify-center p-8">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6 rounded-full">
                <Link href="/upload" className="flex items-center gap-2">
                  Analyze My Policy
                  <Zap className="w-5 h-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default AboutPage


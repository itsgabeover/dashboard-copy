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
  ArrowDownToLine,
  ArrowUpToLine,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { FC } from "react"
import PolicyReviewQuiz from "@/components/PolicyReviewQuiz"

const AboutPage: FC = () => {
  const scrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId)
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="flex flex-col min-h-screen">
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
      <section className="relative bg-gradient-to-b from-gray-100 to-blue-100/50 py-20 md:py-32 lg:py-48">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#4B6FEE] mb-6 leading-tight">
              When Was Your Last Policy Checkup?
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Life moves fast. Markets change. Opportunities emerge. Make sure your life insurance keeps pace with your
              life.
            </p>
            <Button
              size="lg"
              className="bg-[#4B6FEE] hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:transform hover:scale-105 shadow-lg"
              onClick={() => scrollToSection("policy-signs")}
            >
              Learn More
            </Button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Three Signs You Need a Policy Review Section with Quiz */}
      <section id="policy-signs" className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#4B6FEE] mb-12">
              Three Signs You Need a Policy Review
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: TrendingUp,
                  title: "Life Changes",
                  items: ["Major life events", "Career shifts", "New financial goals"],
                },
                {
                  icon: AlertTriangle,
                  title: "Policy Performance",
                  items: ["Premium fluctuations", "Market impacts", "Expiring guarantees"],
                },
                {
                  icon: Shield,
                  title: "Coverage Evolution",
                  items: ["New protection types", "Enhanced benefits", "Tax law opportunities"],
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

            {/* Quiz Section */}
            <div className="max-w-2xl mx-auto">
              <PolicyReviewQuiz />
            </div>
          </div>
        </div>
      </section>

      {/* The Insurance Planner AI Advantage Section */}
      <section id="ai-advantage" className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#4B6FEE] mb-12">
              The Insurance Planner AI Advantage
            </h2>
            <Card className="bg-white p-8 shadow-lg border-blue-100 mb-16 overflow-hidden">
              <CardContent className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-[#4B6FEE] mb-4 flex items-center">
                    <ArrowDownToLine className="w-6 h-6 mr-2 text-red-400" />
                    Traditional Review
                  </h3>
                  {[
                    {
                      icon: Clock,
                      title: "Time-consuming",
                      description: "Hours of manual document review",
                    },
                    {
                      icon: AlertTriangle,
                      title: "Error-prone",
                      description: "Key details often overlooked",
                    },
                    { icon: FileText, title: "Surface-level", description: "Basic policy summary" },
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
                  <h3 className="text-2xl font-semibold text-[#4B6FEE] mb-4 flex items-center">
                    <ArrowUpToLine className="w-6 h-6 mr-2 text-green-400" />
                    Insurance Planner AI
                  </h3>
                  {[
                    { icon: Zap, title: "Lightning-fast", description: "5-minute AI-powered analysis" },
                    { icon: Search, title: "Comprehensive", description: "Every feature examined" },
                    {
                      icon: Lightbulb,
                      title: "Actionable insights",
                      description: "Clear, personalized recommendations",
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

            {/* Ready to review your policy? CTA */}
            <Card className="border-2 border-blue-100 bg-white transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
              <CardHeader className="text-center bg-gradient-to-r from-[#4B6FEE] to-blue-500 text-white p-8">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="rounded-full bg-white/10 p-2 transition-transform duration-300 group-hover:scale-110">
                    <Zap className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">Ready to review your policy?</h2>
                </div>
                <p className="text-xl text-blue-100">
                  From questions to clarity in minutes. Our AI technology evaluates every aspect of your coverage to
                  ensure it is working exactly as it should.
                </p>
              </CardHeader>
              <CardContent className="flex justify-center p-8 bg-gradient-to-b from-white to-blue-50/30">
                <Button
                  asChild
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
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
      </section>
    </div>
  )
}

export default AboutPage


"use client"

import { useState } from "react"
import {
  Compass,
  FileText,
  BarChart,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  BookOpen,
  FileCheck,
  Zap,
  ArrowRight,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface QuickAccessTile {
  title: string
  icon: React.ElementType
  description: string
}

interface ExpandableSection {
  title: string
  icon: React.ElementType
  content: React.ReactNode
}

interface CaseStudy {
  title: string
  problem: string
  solution: string
  result: string
}

interface FAQCategory {
  category: string
  questions: { question: string; answer: string }[]
}

export default function ResourcesPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const quickAccessTiles: QuickAccessTile[] = [
    {
      title: "Getting Started Guide",
      icon: Compass,
      description: "See how our AI analysis works in 3 simple steps",
    },
    {
      title: "Get Your Illustration",
      icon: FileText,
      description: "Easy instructions to get the right policy illustration",
    },
    {
      title: "Your Analysis Guide",
      icon: BarChart,
      description: "A guide to understanding your AI policy analysis",
    },
  ]

  const learningCenter: ExpandableSection = {
    title: "Learning Center",
    icon: BookOpen,
    content: (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Video Tutorials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "How to Request Your Illustration", duration: "2 min" },
                { title: "Uploading Your Policy Documents", duration: "2 min" },
                { title: "Reading Your AI Analysis", duration: "4 min" },
                { title: "Taking Action on Your Results", duration: "3 min" },
              ].map((video, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="bg-[#4B6FEE]/10 p-2 rounded-full">
                    <PlayCircle className="w-6 h-6 text-[#4B6FEE]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{video.title}</p>
                    <p className="text-sm text-gray-500">{video.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Insurance Terms Glossary</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="search"
              placeholder="Search terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            <p>Insurance terms in plain English - search common policy terms and get clear explanations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Educational Guides</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Your Policy Type Explained Simply</li>
              <li>Understanding Your Premium Payments</li>
              <li>How Your Policy Creates Value</li>
              <li>Policy Benefits Guide</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    ),
  }

  const caseStudies: CaseStudy[] = [
    {
      title: "Premium Optimization Case",
      problem: "High premiums affecting budget",
      solution: "Restructured payment schedule",
      result: "20% reduction in annual costs",
    },
    {
      title: "Coverage Gap Discovery",
      problem: "Insufficient life insurance",
      solution: "Identified coverage shortfall",
      result: "Increased protection by $500,000",
    },
    {
      title: "Policy Rescue Story",
      problem: "Policy nearing lapse",
      solution: "Adjusted premium allocation",
      result: "Extended coverage by 15 years",
    },
    {
      title: "Value Enhancement Example",
      problem: "Underutilized cash value",
      solution: "Explored policy loan options",
      result: "Funded child&apos;s education",
    },
  ]

  const faqCategories: FAQCategory[] = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I request an illustration?",
          answer: (
            <div className="space-y-2">
              <p>Contact your insurance carrier using our provided template.</p>
              <p>
                <Link
                  href="/illustration-helper"
                  className="text-blue-500 hover:text-blue-700 underline inline-flex items-center gap-1"
                >
                  Don't have an illustration? We'll help you get one <ChevronRight className="w-4 h-4" />
                </Link>
              </p>
            </div>
          ),
        },
        {
          question: "What documents do I need?",
          answer: "You will need your most recent policy in-force illustration.",
        },
        {
          question: "How long does it take to get an in-force illustration?",
          answer: "It can vary but typically takes a few days.",
        },
      ],
    },
    {
      category: "Understanding Results",
      questions: [
        {
          question: "How do I read my analysis?",
          answer:
            "Your analysis is organized into key sections covering Protection Overview, Policy Features, Benefits & Riders, and Management Strategy. Each section highlights Hidden Gems, Blind Spots, and Red Flags to help you understand your coverage.",
        },
        {
          question: "What are the key terms I should know?",
          answer:
            "Essential terms include Death Benefit (your policy's payout amount), Cash Value (your policy's accumulated value), Premium (your payment), and Riders (additional benefits). Each section of your analysis explains relevant terms in context.",
        },
        {
          question: "What actions should I take after receiving my results?",
          answer:
            "Review your policy's 'Key Takeaways' sections, note questions for your advisor, and focus on any Red Flags identified in the analysis. Pay special attention to premium payment requirements and guarantee provisions.",
        },
      ],
    },
    {
      category: "Working with Advisors",
      questions: [
        {
          question: "Can I share my analysis with my financial advisor?",
          answer:
            "Absolutely! While Insurance Planner AI provides data-driven insights, your financial advisor brings invaluable expertise to interpret these findings within your broader financial picture. We encourage sharing this analysis to spark meaningful discussions about your coverage.",
        },
        {
          question: "How can my advisor use this information?",
          answer:
            "Your advisor can use our AI-generated insights as a starting point to evaluate your coverage needs, assess policy performance, and align your insurance strategy with your financial goals. Remember: we provide analysis, but your advisor provides the professional guidance to act on these insights.",
        },
        {
          question: "Do you recommend specific advisors?",
          answer:
            "No - Insurance Planner AI is an analytical tool, not a advisory service. We never recommend, endorse, or replace financial advisors. Our role is to provide clear policy insights that enhance the valuable conversations you have with your trusted financial professional.",
        },
      ],
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "How is my data kept secure?",
          answer:
            "Our platform employs end-to-end TLS 1.2+ encryption with HTTPS enforcement across all system components, including client browsers, cloud services, and third-party API integrations, ensuring data security during transit.",
        },
        {
          question: "What file formats do you accept?",
          answer: "We accept PDF files for policy illustrations.",
        },
        {
          question: "How can I get help if I'm stuck?",
          answer: "Contact our support team at support@financialplanner-ai.com",
        },
      ],
    },
  ]

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

      {/* Construction Notice */}
      <div className="bg-yellow-50 border-b border-yellow-100 p-4">
        <div className="container mx-auto">
          <p className="text-center text-yellow-800">
            Page Under Construction - We're currently updating this help center. Button functionality is temporarily
            disabled while we make improvements to better serve you.
          </p>
        </div>
      </div>

      <section className="w-full bg-gradient-to-b from-gray-100 to-blue-100/50 flex-grow">
        <div className="container mx-auto px-4 pt-16 md:pt-24 lg:pt-32">
          {/* Header */}
          <div className="flex flex-col items-center space-y-6 text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#4B6FEE] mb-4 tracking-tight">
              Policy Review Help Center
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl">
              Everything you need to get the most from your AI policy analysis
            </p>
          </div>

          {/* Quick Access Tiles */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {quickAccessTiles.map((tile, index) => (
              <Card
                key={index}
                className="transition-all hover:shadow-lg bg-gradient-to-br from-white to-blue-50 transform hover:scale-105 duration-300 flex flex-col"
              >
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  <div className="flex-1 flex flex-col items-center justify-between w-full">
                    <div>
                      <div className="bg-[#4B6FEE]/10 p-4 rounded-full mb-6 transform transition-all duration-300 hover:scale-110 hover:bg-[#4B6FEE]/20">
                        <tile.icon className="w-10 h-10 text-[#4B6FEE]" />
                      </div>
                      <CardTitle className="text-xl font-semibold mb-3">{tile.title}</CardTitle>
                      <CardDescription className="mb-6">{tile.description}</CardDescription>
                    </div>
                    <Button variant="outline" className="w-full mt-4" asChild>
                      <Link href={tile.title === "Get Your Illustration" ? "/illustration-helper" : "#"}>
                        {tile.title === "Get Your Illustration" ? "Request Illustration" : "Learn More"}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="space-y-8 mb-16">
            {[learningCenter].map((section, index) => (
              <Card key={index} className="transition-all hover:shadow-lg bg-white">
                <CardHeader
                  className="flex flex-row items-center justify-between cursor-pointer"
                  onClick={() => toggleSection(section.title)}
                >
                  <div className="flex items-center">
                    <section.icon className="w-6 h-6 text-[#4B6FEE] mr-2" />
                    <CardTitle>{section.title}</CardTitle>
                  </div>
                  {expandedSection === section.title ? <ChevronUp /> : <ChevronDown />}
                </CardHeader>
                {expandedSection === section.title && <CardContent>{section.content}</CardContent>}
              </Card>
            ))}
          </div>

          {/* Case Studies & Success Stories */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-[#4B6FEE] mb-8">Case Studies & Success Stories</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {caseStudies.map((study, index) => (
                <Card key={index} className="transition-all hover:shadow-lg bg-white">
                  <CardHeader>
                    <CardTitle>{study.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>Challenge:</strong> {study.problem}
                    </p>
                    <p>
                      <strong>Solution:</strong> {study.solution}
                    </p>
                    <p>
                      <strong>Outcome:</strong> {study.result}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Support Resources */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-[#4B6FEE] mb-8">Support Resources</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqCategories.map((category, categoryIndex) => (
                <AccordionItem key={categoryIndex} value={`category-${categoryIndex}`}>
                  <AccordionTrigger className="text-xl font-semibold text-[#4B6FEE]">
                    {category.category}
                  </AccordionTrigger>
                  <AccordionContent>
                    <Accordion type="single" collapsible>
                      {category.questions.map((faq, faqIndex) => (
                        <AccordionItem key={faqIndex} value={`faq-${categoryIndex}-${faqIndex}`}>
                          <AccordionTrigger className="text-lg font-medium">{faq.question}</AccordionTrigger>
                          <AccordionContent className="text-gray-700">{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Bottom Call to Action */}
          <Card className="border-2 border-blue-100 bg-white transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden mb-16">
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
                disabled
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Link href="/upload" className="flex items-center gap-2">
                  Start My Analysis
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}


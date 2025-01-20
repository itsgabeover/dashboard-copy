"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Compass,
  FileText,
  BarChart,
  ChevronDown,
  ChevronUp,
  X,
  Download,
  PlayCircle,
  Search,
  BookOpen,
  FileCheck,
  Clock,
  HelpCircle,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type QuickAccessTile = {
  title: string
  icon: React.ElementType
  description: string
  link: string
}

type ExpandableSection = {
  title: string
  icon: React.ElementType
  content: React.ReactNode
}

type CaseStudy = {
  title: string
  problem: string
  solution: string
  result: string
}

type FAQCategory = {
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
      title: "Quick Start Guide",
      icon: Compass,
      description: "New to policy reviews? Start here",
      link: "/quick-start-guide",
    },
    {
      title: "Request Templates",
      icon: FileText,
      description: "Ready-to-use carrier request forms",
      link: "/request-templates",
    },
    {
      title: "Sample Reports",
      icon: BarChart,
      description: "See how we analyze your policy",
      link: "/sample-reports",
    },
  ]

  const essentialTools: ExpandableSection = {
    title: "Essential Tools",
    icon: FileCheck,
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Template Library</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>All request forms by policy type</li>
              <li>Carrier contact directory</li>
              <li>Policy identifier guide</li>
              <li>Request instructions PDF</li>
              <li>Policy review checklist</li>
              <li>Timeline expectations guide</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    ),
  }

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "How to Request an IFL", duration: "2 min" },
                { title: "Reading Your Analysis", duration: "3 min" },
                { title: "Understanding Policy Values", duration: "4 min" },
                { title: "Working with Your Advisor", duration: "2 min" },
              ].map((video, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <PlayCircle className="text-[#4B6FEE]" />
                  <div>
                    <p className="font-medium">{video.title}</p>
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
            <p>Comprehensive terms list with simple explanations and common features guide.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Educational Guides</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Policy types explained</li>
              <li>Premium structure guide</li>
              <li>Policy values explained</li>
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
      result: "Funded child's education",
    },
  ]

  const faqCategories: FAQCategory[] = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I request an illustration?",
          answer: "Contact your insurance carrier using our provided template.",
        },
        {
          question: "What documents do I need?",
          answer: "You'll need your most recent policy statement and in-force illustration.",
        },
        {
          question: "How long does the process take?",
          answer: "Typically 2-3 weeks from request to analysis completion.",
        },
      ],
    },
    {
      category: "Understanding Results",
      questions: [
        { question: "How do I read my analysis?", answer: "We provide a step-by-step guide in your results email." },
        {
          question: "What are the key terms I should know?",
          answer: "Refer to our glossary for explanations of common insurance terms.",
        },
        {
          question: "What actions should I take after receiving my results?",
          answer: "Review our recommended next steps in your analysis report.",
        },
      ],
    },
    {
      category: "Working with Advisors",
      questions: [
        {
          question: "Can I share my analysis with my financial advisor?",
          answer: "Yes, we encourage collaboration with your trusted professionals.",
        },
        {
          question: "How can my advisor use this information?",
          answer: "They can use our insights to refine your overall financial strategy.",
        },
        {
          question: "Do you recommend specific advisors?",
          answer: "No, we remain neutral but support your existing advisory relationships.",
        },
      ],
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "How is my data kept secure?",
          answer: "We use bank-level encryption and never store your personal information.",
        },
        {
          question: "What file formats do you accept?",
          answer: "We accept PDF and Excel files for policy illustrations.",
        },
        {
          question: "How can I get help if I'm stuck?",
          answer: "Contact our support team at support@insuranceplanner-ai.com",
        },
      ],
    },
  ]

  return (
    <section className="w-full bg-gradient-to-b from-gray-100 to-blue-100/50">
      <div className="container mx-auto px-4 pt-16 md:pt-24 lg:pt-32">
        {/* Header */}
        <div className="flex flex-col items-center space-y-6 text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#4B6FEE] mb-4 tracking-tight">
            Policy Analysis Resources
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl">
            Everything you need for a successful policy review - from getting started to understanding your results
          </p>
        </div>

        {/* Quick Access Tiles */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {quickAccessTiles.map((tile, index) => (
            <Card
              key={index}
              className="transition-all hover:shadow-lg bg-white transform hover:scale-105 duration-300"
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-[#4B6FEE]/10 p-3 rounded-full mb-4">
                  <tile.icon className="w-8 h-8 text-[#4B6FEE]" />
                </div>
                <CardTitle className="text-xl font-semibold mb-2">{tile.title}</CardTitle>
                <CardDescription className="mb-4">{tile.description}</CardDescription>
                <Button asChild variant="outline" className="mt-auto">
                  <Link href={tile.link}>Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="space-y-8 mb-16">
          {[essentialTools, learningCenter].map((section, index) => (
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
        <Card className="bg-[#4B6FEE] text-white text-center p-8 mb-16">
          <CardContent>
            <h2 className="text-3xl font-bold mb-4">Ready to Review Your Policy?</h2>
            <Button asChild size="lg" variant="secondary">
              <Link href="/start-analysis">Start My Analysis</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}


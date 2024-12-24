'use client'

import { useState } from 'react'
import { 
  BookOpen, 
  FileText, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  X 
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"

// Add type for resource content
type ResourceContent = {
  name: string
  type: string
  action: string
  link?: string
}

// Add type for resource
type Resource = {
  title: string
  icon: React.ElementType
  description: string
  content: ResourceContent[]
}

// Add type for FAQ question
type FAQQuestion = {
  question: string
  answer: React.ReactNode
}

// Add type for FAQ category
type FAQCategory = {
  category: string
  questions: FAQQuestion[]
}

export default function ResourcesPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
      setTimeout(() => {
        const element = document.getElementById(section)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }

  const resources: Resource[] = [
    {
      title: 'Practice Planning',
      icon: BookOpen,
      description: 'Must have Advisor Resources',
      content: [
        { name: 'Client Engagement Email', type: 'PDF', action: 'Download' },
        { name: 'IFL Request Form', type: 'PDF', action: 'Download' }
      ]
    },
    {
      title: 'Sample Reports',
      icon: FileText,
      description: 'Advisor Analysis and Client Summary',
      content: [
        { 
          name: 'Advisor Analysis', 
          type: 'PDF', 
          action: 'Download',
          link: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IP%20AI%20ANALYSIS%20Sample-70EjJp7rBVSnRVSXDpgynLK20VtqF0.html'
        },
        { 
          name: 'Client Summary', 
          type: 'PDF', 
          action: 'Download',
          link: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IP%20AI%20SUMMARY%20Sample-y2eG2cyjpvjXlp5MsXhv9J7RWA11Ld.html'
        }
      ]
    }
  ]

  const faqs: FAQCategory[] = [
    {
      category: 'Getting Started',
      questions: [
        {
          question: 'How do I begin using the platform?',
          answer: 'Simply upload your in-force illustration and provide your email. Our AI will analyze the policy and send you comprehensive reports within minutes.'
        },
        {
          question: 'What file formats are accepted?',
          answer: 'We currently accept PDF files of in-force illustrations from major insurance carriers.'
        }
      ]
    },
    {
      category: 'Analysis Process',
      questions: [
        {
          question: 'How long does the analysis take?',
          answer: 'Most analyses are completed within 5 minutes. You&apos;ll receive an email notification when your reports are ready.'
        },
        {
          question: 'What&apos;s included in the analysis?',
          answer: 'Our analysis includes policy performance metrics, risk assessment, and actionable recommendations.'
        }
      ]
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0]">
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-800 mb-4">
              Resources
            </h1>
            <p className="text-xl text-gray-600">
              Essential tools and information for insurance professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {resources.map((resource, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-[#4B6FEE]/10 p-3 rounded-full">
                    <resource.icon className="w-6 h-6 text-[#4B6FEE]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900">{resource.title}</h3>
                    <p className="text-gray-600">{resource.description}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {resource.content.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">{item.name}</span>
                      </div>
                      <Button 
                        asChild
                        variant="ghost" 
                        size="sm"
                        className="text-[#4B6FEE] hover:text-[#4B6FEE] hover:bg-[#4B6FEE]/10"
                      >
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4 mr-2" />
                          {item.action}
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold text-gray-800 mb-8">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-8">
                  <h3 className="text-xl font-medium text-gray-900 mb-4">
                    {category.category}
                  </h3>
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem 
                      key={faqIndex} 
                      value={`${categoryIndex}-${faqIndex}`}
                      className="bg-white border rounded-lg mb-4"
                    >
                      <AccordionTrigger className="px-6 hover:no-underline">
                        <span className="text-left font-medium text-gray-900">
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4 text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </div>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </main>
  )
}

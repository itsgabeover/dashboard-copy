'use client'

import { useState } from 'react'
import { 
  ArrowRight, 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Lightbulb, 
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

// Type definitions
type ResourceContent = {
  name: string
  type: string
  action: string
  link?: string
}

type Resource = {
  title: string
  icon: React.ElementType
  description: string
  content: ResourceContent[]
}

type FAQQuestion = {
  question: string
  answer: React.ReactNode
}

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
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
      category: "About IP-AI",
      questions: [
        {
          question: "What is IP-AI?",
          answer: "IP-AI is an AI-powered platform that helps financial advisors conduct life insurance policy reviews in minutes. We analyze in-force illustrations and deliver both technical advisor reports and client-ready summaries."
        },
        {
          question: "Why use IP-AI?",
          answer: "Advisors use IP-AI to transform time-consuming policy reviews into a streamlined process. Our technology makes this practical by reducing analysis time from hours to minutes."
        }
      ]
    },
    {
      category: "Getting Started",
      questions: [
        {
          question: "What do I need to begin?",
          answer: "Just two things: A current in-force illustration (PDF) and your email address for report delivery."
        },
        {
          question: "What types of policies can be analyzed?",
          answer: "We analyze permanent life insurance policies including: Universal Life, Indexed Universal Life, Variable Universal Life, and Whole Life."
        }
      ]
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0]">
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-[#4B6FEE] mb-6 tracking-tight">
              Resources for Advisors
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to implement policy reviews in your practice
            </p>
          </div>

          {/* Resource Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            {resources.map((resource, index) => (
              <Card
                key={index}
                className="relative overflow-hidden transition-all duration-300 hover:shadow-lg bg-white"
              >
                <div className="p-8">
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="bg-[#4B6FEE]/10 p-4 rounded-full mb-4">
                      <resource.icon className="w-12 h-12 text-[#4B6FEE]" aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{resource.title}</h3>
                    <p className="text-gray-600">{resource.description}</p>
                  </div>
                  
                  <Button
                    onClick={() => toggleSection(resource.title)}
                    className="w-full bg-white border-2 border-[#4B6FEE] text-[#4B6FEE] hover:bg-[#4B6FEE] hover:text-white transition-colors"
                    aria-expanded={expandedSection === resource.title}
                    aria-controls={`${resource.title}-content`}
                  >
                    {expandedSection === resource.title ? (
                      <ChevronUp className="mr-2 h-5 w-5" />
                    ) : (
                      <ChevronDown className="mr-2 h-5 w-5" />
                    )}
                    {expandedSection === resource.title ? 'Close' : 'View Resources'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Expanded Resource Section */}
          {expandedSection && (
            <div 
              id={expandedSection}
              className="bg-white rounded-lg shadow-md p-6 mb-16 max-w-5xl mx-auto animate-fadeIn"
              role="region"
              aria-labelledby={`${expandedSection}-title`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 id={`${expandedSection}-title`} className="text-2xl font-semibold text-[#4B6FEE]">
                  {expandedSection}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setExpandedSection(null)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close section"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {resources
                  .find(r => r.title === expandedSection)
                  ?.content.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:border-[#4B6FEE] transition-colors"
                    >
                      <span className="font-medium text-gray-700">{item.name}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#4B6FEE] text-[#4B6FEE] hover:bg-[#4B6FEE] hover:text-white"
                        onClick={() => item.link && window.open(item.link, '_blank')}
                        disabled={!item.link}
                        aria-label={`Download ${item.name}`}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        {item.action}
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-md p-8 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-[#4B6FEE] mb-8">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((category, categoryIndex) => (
                <AccordionItem
                  key={categoryIndex}
                  value={`category-${categoryIndex}`}
                  className="border-b border-gray-200"
                >
                  <AccordionTrigger className="text-xl font-semibold text-[#4B6FEE] hover:no-underline">
                    {category.category}
                  </AccordionTrigger>
                  <AccordionContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((faq, faqIndex) => (
                        <AccordionItem
                          key={faqIndex}
                          value={`faq-${categoryIndex}-${faqIndex}`}
                          className="border-b border-gray-100"
                        >
                          <AccordionTrigger className="text-lg font-medium hover:no-underline">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-700 leading-relaxed">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </main>
  )
}

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
          link: 'https://phw1ruho25yy63z9.public.blob.vercel-storage.com/SAMPLE%20ANALYSIS-KcNItO6ThA29F15Sa0kuWc4uySibb9.pdf'
        },
        { 
          name: 'Client Summary', 
          type: 'PDF', 
          action: 'Download',
          link: 'https://phw1ruho25yy63z9.public.blob.vercel-storage.com/SAMPLE%20SUMMARY-gN6m36r8cHAwdzi68E4adsDuqypPMT.pdf'
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
          answer: "IP-AI is an AI-powered platform that helps financial advisors conduct life insurance policy reviews in minutes. We analyze in-force illustrations and deliver both technical advisor reports and client-ready summaries, enabling advisors to provide thorough policy reviews efficiently."
        },
        {
          question: "Why use IP-AI?",
          answer: "Advisors use IP-AI to transform time-consuming policy reviews into a streamlined process. Just like investment portfolio reviews, regular policy monitoring helps ensure coverage stays aligned with client goals. Our technology makes this practical by reducing analysis time from hours to minutes."
        },
        {
          question: "How does it work?",
          answer: "Simply upload an in-force illustration and receive two professional reports: A technical analysis for advisors and a client-ready summary for presentations."
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
          question: "Is there software to install?",
          answer: "No. IP-AI is web-based - there's nothing to install or maintain. Just upload your illustration and receive your analysis."
        },
        {
          question: "What types of policies can be analyzed?",
          answer: "We analyze permanent life insurance policies including: Universal Life, Indexed Universal Life, Variable Universal Life, and Whole Life."
        }
      ]
    },
    {
      category: "Technical Details",
      questions: [
        {
          question: "What format do you accept?",
          answer: "PDF format only and 2MB maximum file size.  The file should be a current in-force illustration from the carrier."
        },
        {
          question: "How quickly do I receive results?",
          answer: "Analysis and reports are delivered to your email typically within minutes of upload."
        }
      ]
    },
    {
      category: "Practice Implementation",
      questions: [
        {
          question: "How do I integrate this service into my practice?",
          answer: "Most advisors start by: Running a few policy reviews to experience the process, creating a systematic review schedule, using our templates to communicate with clients, and making policy reviews part of their client relationship strategy."
        },
        {
          question: "What do I receive with each analysis?",
          answer: "Two professional reports: 1) Technical Analysis (for advisors): Comprehensive policy review, risk assessment, action items, performance metrics. 2) Client Summary: Clear explanations, key findings, next steps, professional formatting."
        },
        {
          question: "How do I explain policy reviews to clients?",
          answer: "Position policy reviews like investment portfolio reviews - a natural part of your comprehensive wealth management approach. Our client-ready reports help facilitate these discussions professionally."
        }
      ]
    },
    {
      category: "Compliance & Best Practices",
      questions: [
        {
          question: "What compliance considerations should I keep in mind?",
          answer: "We recommend consulting with your firm's compliance team before sharing IP-AI reports with clients. Consider reviewing analysis against the actual in-force illustration and following your firm's protocols for client communications."
        },
        {
          question: "How should I verify the analysis?",
          answer: "While our AI technology is efficient, cross-checking analysis with the actual in-force illustration helps ensure accuracy. Consider verifying key metrics and findings as part of your review process."
        },
        {
          question: "What are IP-AI's limitations?",
          answer: "Like all AI technology, IP-AI is evolving and serves as a tool to enhance professional service. Our analysis is designed to support, not replace, advisor expertise and professional judgment."
        },
        {
          question: "How should I handle IP-AI reports?",
          answer: "Check with your compliance team about using AI-generated analysis in client communications."
        }
      ]
    },
    {
      category: "Support",
      questions: [
        {
          question: "What if I need help?",
          answer: <>Support is available at <a href="mailto:support@financialplanner-ai.com" className="text-[#4B6FEE] hover:underline">support@financialplanner-ai.com</a>. We typically respond within one business day.</>
        },
        {
          question: "Do you provide training?",
          answer: "The platform is designed to be intuitive with no training needed. However, we provide guides and templates to help you implement policy reviews in your practice."
        },
        {
          question: "Can IP-AI replace my expertise?",
          answer: "No - IP-AI enhances your expertise by handling time-consuming analysis, allowing you to focus on what matters most: guiding your clients with professional insights and recommendations."
        }
      ]
    },
    {
      category: "Refund Policy",
      questions: [
        {
          question: "What is your refund policy?",
          answer: "We offer a No-Risk First Purchase Guarantee. If you are a first-time user and are not satisfied, you will receive a full refund within 14 days - no questions asked."
        },
        {
          question: "How do I request a refund?",
          answer: <>To request a refund, email <a href="mailto:support@fpai.com" className="text-[#4B6FEE] hover:underline">support@financialplanner-ai.com</a> and request a refund. You will receive a full refund within 14 days.</>
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

"use client";

import { useState } from "react";
import {
  BookOpen,
  FileText,
  Download,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

// Type definitions
type ResourceContent = {
  name: string;
  type: string;
  action: string;
  link?: string;
};

type Resource = {
  title: string;
  icon: React.ElementType;
  description: string;
  content: ResourceContent[];
};

type FAQQuestion = {
  question: string;
  answer: React.ReactNode;
};

type FAQCategory = {
  category: string;
  questions: FAQQuestion[];
};

export default function ResourcesPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
      setTimeout(() => {
        const element = document.getElementById(section);
        element?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const resources: Resource[] = [
    {
      title: "Getting Started",
      icon: BookOpen,
      description: "Essential Resources for Understanding Your Policy",
      content: [
        {
          name: "Illustration Request Template",
          type: "PDF",
          action: "Download",
          link: "/resources/illustration_request_template.txt",
        },
        { name: "Common Insurance Terms", type: "PDF", action: "Download",
          link: "/resources/common_insurance_terms.txt",
          },
      ],
    },
    {
      title: "Sample Reports",
      icon: FileText,
      description: "See How We Analyze Your Policy",
      content: [
        {
          name: "Sample Professional Analysis PDF",
          type: "PDF",
          action: "Download",
          link: "/sample_reports/SAMPLE_POLICY_REVIEW.docx",
        },
        {
          name: "Sample Email Summary",
          type: "PDF",
          action: "Download",
          link: "/sample_reports/SAMPLE_CLIENT_SUMMARY.docx",
        },
      ],
    },
  ];

  const faqs: FAQCategory[] = [
    {
      category: "What We Do",
      questions: [
        {
          question: "What is Insurance Planner AI?",
          answer:
            "We provide objective AI-powered analysis of life insurance policy illustrations. We're not an insurance company, agent, or advisor - we don't sell, solicit, recommend, or endorse any insurance products or companies. Our role is simply to help you understand your existing policy better.",
        },
        {
          question: "What exactly do you analyze?",
          answer:
            "Our AI analyzes only the information contained in your in-force illustration. We deliver two outputs: a clear email summary and a detailed PDF report. Remember that our analysis is based solely on your illustration - actual policy performance may vary based on market conditions and insurance company performance.",
        },
        {
          question: "Are you providing financial advice?",
          answer:
            "No. We provide policy analysis, not advice. We don't offer tax, legal, insurance, or financial advice. Think of us as a translation tool - we help you understand your policy details so you can have more informed discussions with your professional advisors.",
        },
      ],
    },
    {
      category: "Getting Started",
      questions: [
        {
          question: "What do I need to begin?",
          answer:
            "Just two things: a current in-force illustration (we'll show you how to get one) and an email address. Our analysis is based solely on the illustration provided.",
        },
        {
          question: "How do I get my in-force illustration?",
          answer:
            "Request it from your insurance carrier - we provide a template letter and contact information. Typically takes 2-3 weeks. Remember, you'll want a current illustration as policy values and projections can change over time.",
        },
        {
          question: "What types of policies can be analyzed?",
          answer:
            "We analyze permanent life insurance policies including: Universal Life, Indexed Universal Life, Variable Universal Life, and Whole Life.",
        },
      ],
    },
    {
      category: "Working with Advisors",
      questions: [
        {
          question: "Can I share the analysis with my advisor?",
          answer:
            "Yes! We provide both a consumer-friendly summary and a detailed professional analysis specifically designed for advisor review.",
        },
        {
          question: "Do I need an advisor to use this service?",
          answer:
            "No - our service is designed for both direct consumer use and professional advisor collaboration.",
        },
      ],
    },
    {
      category: "Understanding Results",
      questions: [
        {
          question: "What will I receive?",
          answer:
            "You'll receive two items: 1) A clear email summary in plain English, and 2) A detailed Professional Analysis PDF suitable for your advisor. Both are based on your illustration and should be used as discussion tools with your advisors, not as the sole basis for decisions.",
        },
        {
          question: "How quickly do I receive results?",
          answer:
            "Once you upload your illustration, the analysis takes about 5 minutes. While our AI technology is efficient, it can occasionally misinterpret information, which is why we encourage reviewing results with your professional advisors.",
        },
      ],
    },
    {
      category: "Support & Policies",
      questions: [
        {
          question: "What if I need help?",
          answer: (
            <>
              Support is available at{" "}
              <a
                href="mailto:support@financialplanner-ai.com"
                className="text-[#4B6FEE] hover:underline"
              >
                support@financialplanner-ai.com
              </a>
              . We typically respond within one business day. We can help with
              technical issues but cannot provide insurance, financial, legal,
              or tax advice.
            </>
          ),
        },
        {
          question: "What's your refund policy?",
          answer:
            "We offer a 14-day money-back guarantee for first-time users if you're not satisfied with your analysis. Simply email support with your request.",
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0]">
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-[#4B6FEE] mb-6 tracking-tight">
              Policy Analysis Resources
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to understand and review your life insurance
              policy
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
                      <resource.icon
                        className="w-12 h-12 text-[#4B6FEE]"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      {resource.title}
                    </h3>
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
                    {expandedSection === resource.title
                      ? "Close"
                      : "View Resources"}
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
                <h3
                  id={`${expandedSection}-title`}
                  className="text-2xl font-semibold text-[#4B6FEE]"
                >
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
                  .find((r) => r.title === expandedSection)
                  ?.content.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:border-[#4B6FEE] transition-colors"
                    >
                      <span className="font-medium text-gray-700">
                        {item.name}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#4B6FEE] text-[#4B6FEE] hover:bg-[#4B6FEE] hover:text-white"
                        disabled={!item.link}
                        aria-label={`Download ${item.name}`}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        <a href={item.link} target="_blank" rel="noopener noreferrer" download>
                        {item.action}
                        </a>
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
  );
}

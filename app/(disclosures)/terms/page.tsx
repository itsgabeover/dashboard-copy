"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("1")

  const sections = [
    { id: "1", title: "Introduction and Acceptance" },
    { id: "2", title: "Definitions and Interpretation" },
    { id: "3", title: "Eligibility and Registration" },
    { id: "4", title: "Service Description and Scope" },
    { id: "5", title: "Critical Limitations and Disclaimers" },
    { id: "6", title: "Data Rights and Privacy" },
    { id: "7", title: "Payment Terms and Conditions" },
    { id: "8", title: "Usage Restrictions and Requirements" },
    { id: "9", title: "Intellectual Property Rights" },
    { id: "10", title: "Third-Party Services and Content" },
    { id: "11", title: "Warranties and Disclaimers" },
    { id: "12", title: "Limitation of Liability" },
    { id: "13", title: "Dispute Resolution and Arbitration" },
    { id: "14", title: "Indemnification" },
    { id: "15", title: "Term and Termination" },
    { id: "16", title: "General Provisions" },
    { id: "17", title: "Contact Information" },
  ]

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <nav className="w-full lg:w-1/4">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="pr-4">
              {sections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "ghost"}
                  className="w-full justify-start mb-2 text-left"
                  onClick={() => setActiveSection(section.id)}
                >
                  <span className="truncate">{section.title}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </nav>
        <main className="w-full lg:w-3/4">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h1>TERMS OF SERVICE</h1>
              <p>
                <strong>Effective Date: January 1, 2025</strong>
              </p>

              <div className="bg-muted p-4 rounded-lg mb-8">
                <strong>IMPORTANT NOTICE REGARDING YOUR LEGAL RIGHTS</strong>
                <p className="mt-2">
                  {
                    "PLEASE READ THESE TERMS OF SERVICE CAREFULLY. THEY CONTAIN AN ARBITRATION AGREEMENT AND CLASS ACTION WAIVER THAT AFFECT YOUR LEGAL RIGHTS."
                  }
                </p>
              </div>

              <p>
                {
                  "By accessing or using the Services provided by Financial Planner AI, LLC, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service, including the binding arbitration provision and class action waiver found in Section 12."
                }
              </p>

              <h2 id="section-1">1. INTRODUCTION AND ACCEPTANCE</h2>
              <p>
                {
                  'Welcome to Financial Planner AI. These Terms of Service (the "Terms") constitute a legally binding agreement between you and Financial Planner AI, LLC, a limited liability company organized under the laws of New Jersey ("Financial Planner AI," "we," "our," or "us"). These Terms govern your access to and use of our website located at https://www.lifeinsuranceplanner-ai.com (the "Website"), our proprietary web-based software application (the "Application"), our AI-powered analysis feature ("Insurance Planner AI"), our chatbot service, and all related services (collectively, the "Services").'
                }
              </p>

              {/* Continue with all sections, ensuring proper escaping of quotes and apostrophes */}

              <div className="mt-8 pt-8 border-t">
                <p className="text-sm text-muted-foreground">
                  {"Last Updated: January 29, 2025"}
                  <br />
                  {"© 2025 Financial Planner AI, LLC. All rights reserved."}
                </p>
              </div>
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  )
}


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TermsContent } from "./terms-content"

export default function TermsOfService() {
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
              <TermsContent />
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  )
}


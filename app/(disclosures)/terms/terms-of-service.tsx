"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

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

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState("1")

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <nav className="w-full lg:w-1/4">
          <div className="sticky top-8">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "ghost"}
                className="w-full justify-start mb-2 text-left"
                onClick={() => {
                  setActiveSection(section.id)
                  document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                <span className="truncate">{section.title}</span>
              </Button>
            ))}
          </div>
        </nav>
        <main className="w-full lg:w-3/4">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {sections.map((section) => (
              <section key={section.id} id={`section-${section.id}`} className="mb-8">
                <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                <p>{`Content for ${section.title}. Replace this with the actual content from your MDX file.`}</p>
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}


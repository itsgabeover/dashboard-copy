import React from "react"

interface Section {
  id: string
  title: string
}

interface TermsContentProps {
  sections: Section[]
}

export function TermsContent({ sections }: TermsContentProps) {
  return (
    <div className="space-y-8">
      <section id="important-notice">
        <h1 className="text-4xl font-bold mb-6">TERMS OF SERVICE</h1>
        <p className="font-semibold">Effective Date: January 1, 2025</p>

        <div className="bg-muted p-4 rounded-lg my-8">
          <p className="font-bold">IMPORTANT NOTICE REGARDING YOUR LEGAL RIGHTS</p>
          <p className="mt-2">
            PLEASE READ THESE TERMS OF SERVICE CAREFULLY. THEY CONTAIN AN ARBITRATION AGREEMENT AND CLASS ACTION WAIVER
            THAT AFFECT YOUR LEGAL RIGHTS.
          </p>
        </div>
      </section>

      {sections.map((section) => (
        <section key={section.id} id={`section-${section.id}`} className="space-y-4">
          <h2 className="text-2xl font-bold">{section.title}</h2>
          <p>{`Content for ${section.title}. Replace this with the actual content for each section.`}</p>
        </section>
      ))}

      <footer className="pt-8 border-t">
        <p className="text-sm text-muted-foreground">
          Last Updated: January 29, 2025
          <br />© 2025 Financial Planner AI, LLC. All rights reserved.
        </p>
      </footer>
    </div>
  )
}


export function TermsContent() {
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

      <section id="section-1" className="space-y-4">
        <h2 className="text-2xl font-bold">1. INTRODUCTION AND ACCEPTANCE</h2>
        <p>
          Welcome to Financial Planner AI. These Terms of Service (the "Terms") constitute a legally binding agreement
          between you and Financial Planner AI, LLC, a limited liability company organized under the laws of New Jersey
          ("Financial Planner AI," "we," "our," or "us").
        </p>
        <p>
          These Terms govern your access to and use of our website located at https://www.lifeinsuranceplanner-ai.com
          (the "Website"), our proprietary web-based software application (the "Application"), our AI-powered analysis
          feature ("Insurance Planner AI"), our chatbot service, and all related services (collectively, the
          "Services").
        </p>
      </section>

      {/* Add more sections here for the full terms of service content */}

      <footer className="pt-8 border-t">
        <p className="text-sm text-muted-foreground">
          Last Updated: January 29, 2025
          <br />© 2025 Financial Planner AI, LLC. All rights reserved.
        </p>
      </footer>
    </div>
  )
}


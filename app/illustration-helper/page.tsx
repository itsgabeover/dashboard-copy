"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Home,
  ArrowRight,
  ArrowLeft,
  Zap,
  Shield,
  Clock,
  CheckCircle,
  Copy,
  Check,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  title: string
  description: string | string[]
}

interface IllustrationContent {
  title: string
  description: string
  items: string[]
  script: string
}

interface IllustrationResults {
  [key: string]: IllustrationContent
}

function ProgressSteps({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center mb-12">
      {[1, 2, 3].map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              step <= currentStep ? "bg-[#4B6FEE] text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            {step}
          </div>
          {index < 2 && <div className={`h-0.5 w-16 ${step < currentStep ? "bg-[#4B6FEE]" : "bg-gray-200"}`} />}
        </div>
      ))}
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex items-start gap-4 p-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4B6FEE]/10 text-[#4B6FEE]">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}

interface OptionCardProps {
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
}

function OptionCard({ icon, title, description, onClick }: OptionCardProps) {
  return (
    <Card className="flex flex-col p-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#4B6FEE]/10 text-[#4B6FEE]">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="mb-6 text-gray-600">{description}</p>
      <Button
        onClick={onClick}
        className="mt-auto flex items-center justify-between bg-[#4B6FEE] hover:bg-[#4B6FEE]/90 text-white"
      >
        Select
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </Card>
  )
}

export default function IllustrationHelper() {
  const [step, setStep] = useState(1)
  const [selectedOption, setSelectedOption] = useState<string>("current_review")
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)
  const router = useRouter()

  const handleCopyClick = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const results: IllustrationResults = {
    current_review: {
      title: "Current Performance Illustration",
      description: "This report will show exactly how your policy is performing now and in the future",
      items: [
        "Current death benefit amount and type (Level or Increasing)",
        "Projected cash value accumulation year by year",
        "Current premium amount and payment frequency",
        "Current crediting rate/interest rate assumptions",
        "Guaranteed vs. non-guaranteed values",
        "Current loan balance and impact (if applicable)",
        "Policy expenses and charges",
      ],
      script:
        "I am requesting a current in-force illustration that shows the policy performance maintaining the current annual premium. Please include both guaranteed and non-guaranteed values, current cash value projections, and death benefit projections. We need to see all policy expenses and current crediting rate assumptions. Please run this to age 95. If there are any current loans on the policy, please show their impact on the projections.",
    },
    lower_premium: {
      title: "Minimum Premium Illustration",
      description: "This report will show options for maintaining coverage with lower payments",
      items: [
        "Minimum required premium to maintain coverage",
        "Year-by-year breakdown of minimum premium amounts",
        "Impact on cash value accumulation",
        "Death benefit projections at minimum funding",
        "Policy expense impact at minimum funding",
        "Any potential risks of minimum funding",
      ],
      script:
        "I am requesting a minimum premium in-force illustration. Please calculate the lowest possible premium amount needed to maintain the current death benefit until age 95. The illustration should show:\n1. The minimum annual premium required each year\n2. How this minimum funding affects the cash value\n3. Both guaranteed and non-guaranteed projections\n4. Any years where the minimum premium might need to be adjusted\nPlease note any assumptions used in calculating these minimums.",
    },
    stop_paying: {
      title: "Zero Premium Illustration",
      description: "This report will show what happens if you stop premium payments now",
      items: [
        "Projected policy performance with no future premiums",
        "Year-by-year cash value erosion",
        "Projected year of policy lapse (if applicable)",
        "Death benefit duration without premium",
        "Impact on policy riders or benefits",
        "Required cash value to sustain coverage",
      ],
      script:
        "I am requesting a zero-premium in-force illustration. I need to see what happens if all premium payments stop immediately. Specifically, please show:\n1. How long the current death benefit can remain in force\n2. The year-by-year impact on cash value\n3. When the policy would lapse without additional premiums\n4. Both guaranteed and non-guaranteed scenarios\n5. Any impact on existing riders or benefits\nPlease project this to age 95 or until lapse, whichever comes first.",
    },
  }

  const features: FeatureCardProps[] = [
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: "Step 1: Pick Your Question",
      description: `• "How is my policy really doing?"\n• Can I lower my payments?"\n• "What if I stop paying?"`,
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Step 2: Get Request Script",
      description: `• We provide the exact words\n• Different script for each need\n• Insurance company knows what to send`,
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Step 3: Follow Simple Steps",
      description: `• Find your policy number\n• Choose how to contact insurer\n• Get document in 3-5 days`,
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Quick Results",
      description: "Your policy illustration arrives in 3-5 business days",
    },
  ]

  const options = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "See how my policy is doing",
      description: "Check current performance and future outlook",
      value: "current_review",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Find ways to lower my payments",
      description: "Explore options to reduce premiums",
      value: "lower_premium",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "See what happens if I stop paying",
      description: "Understand my options without more payments",
      value: "stop_paying",
    },
  ]

  const steps: Step[] = [
    {
      title: "Locate your policy number",
      description: "Find this on your policy documents or statements",
    },
    {
      title: "Choose how to contact your insurance company",
      description: [
        "Call: Use the phone number on your policy or statement",
        "Email: Contact your agent or the service department",
        "Online: Log into your insurance company's website",
      ],
    },
    {
      title: "Use our request script",
      description: "Copy the script above for your request",
    },
    {
      title: "What to expect",
      description: "Your illustration should arrive within 3-5 business days",
    },
  ]

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
    setStep(3)
  }

  if (step === 1) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ProgressSteps currentStep={1} />

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">How to Get Your Policy Illustration</h1>
          <p className="text-xl text-gray-600 mb-4">Get the in-force illustration you need for your AI analysis</p>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Tell us what's on your mind about your policy, and we'll help you get the right in-force illustration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        <div className="flex flex-col items-center gap-4">
          <Button onClick={() => setStep(2)} className="bg-[#4B6FEE] hover:bg-[#4B6FEE]/90 text-white">
            Start Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => router.push("/")}>
            <Home className="h-4 w-4" /> Return to Home
          </Button>
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ProgressSteps currentStep={2} />

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">What do you want to know about your policy?</h1>
          <p className="text-xl text-gray-600">We&apos;ll help you request exactly what you need</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {options.map((option, index) => (
            <OptionCard key={index} {...option} onClick={() => handleOptionSelect(option.value)} />
          ))}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" className="gap-2" onClick={() => setStep(1)}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => router.push("/")}>
            <Home className="h-4 w-4" /> Return to Home
          </Button>
        </div>
      </div>
    )
  }

  // Step 3: The detailed illustration helper UI
  const content = results[selectedOption]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <ProgressSteps currentStep={3} />

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3">{content.title}</h1>
        <p className="text-xl text-gray-600">{content.description}</p>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="what-youll-see" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 h-12 items-center bg-gray-100 p-1 rounded-lg">
            <TabsTrigger
              value="what-youll-see"
              className="rounded-md h-10 data-[state=active]:bg-white data-[state=active]:text-[#4B6FEE] data-[state=active]:shadow-sm"
            >
              What You&apos;ll See
            </TabsTrigger>
            <TabsTrigger
              value="request-script"
              className="rounded-md h-10 data-[state=active]:bg-white data-[state=active]:text-[#4B6FEE] data-[state=active]:shadow-sm"
            >
              Request Script
            </TabsTrigger>
            <TabsTrigger
              value="next-steps"
              className="rounded-md h-10 data-[state=active]:bg-white data-[state=active]:text-[#4B6FEE] data-[state=active]:shadow-sm"
            >
              Next Steps
            </TabsTrigger>
          </TabsList>

          <TabsContent value="what-youll-see" className="mt-0">
            <ul className="space-y-4" role="list">
              {content.items.map((item, index) => (
                <li key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="h-2 w-2 rounded-full bg-[#4B6FEE] mt-2 shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="request-script" className="mt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-700">
                  Copy this script when contacting your insurance company:
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "gap-2 transition-colors",
                    copySuccess && "bg-[#4B6FEE] text-white hover:bg-[#4B6FEE]/90",
                  )}
                  onClick={() => handleCopyClick(content.script)}
                >
                  {copySuccess ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copySuccess ? "Copied!" : "Copy"}
                </Button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
                <p className="whitespace-pre-line">{content.script}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="next-steps" className="mt-0">
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <button
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4B6FEE] text-white">
                      {index + 1}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">Step {index + 1}:</div>
                      <div className="font-medium">{step.title}</div>
                    </div>
                    {expandedStep === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  {expandedStep === index && (
                    <div className="px-4 pb-4 pl-16 text-gray-600">
                      {Array.isArray(step.description) ? (
                        <ul className="space-y-2">
                          {step.description.map((item, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-[#4B6FEE]" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>{step.description}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <div className="flex justify-between mt-8">
        <Button variant="outline" className="gap-2" onClick={() => setStep(2)}>
          <ArrowLeft className="h-4 w-4" /> Back to Options
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => router.push("/")}>
          <Home className="h-4 w-4" /> Return to Home
        </Button>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Home,
  ArrowRight,
  ArrowLeft,
  Zap,
  Shield,
  Clock,
  CheckCircle,
  Copy,
  Check,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  title: string
  description: string | string[]
}

interface IllustrationContent {
  title: string
  description: string
  items: string[]
  script: string
}

interface IllustrationResults {
  [key: string]: IllustrationContent
}

function ProgressSteps({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center mb-12">
      {[1, 2, 3].map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              step <= currentStep ? "bg-[#4B6FEE] text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            {step}
          </div>
          {index < 2 && <div className={`h-0.5 w-16 ${step < currentStep ? "bg-[#4B6FEE]" : "bg-gray-200"}`} />}
        </div>
      ))}
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex items-start gap-4 p-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4B6FEE]/10 text-[#4B6FEE]">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}

interface OptionCardProps {
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
}

function OptionCard({ icon, title, description, onClick }: OptionCardProps) {
  return (
    <Card className="flex flex-col p-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#4B6FEE]/10 text-[#4B6FEE]">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="mb-6 text-gray-600">{description}</p>
      <Button
        onClick={onClick}
        className="mt-auto flex items-center justify-between bg-[#4B6FEE] hover:bg-[#4B6FEE]/90 text-white"
      >
        Select
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </Card>
  )
}

export default function IllustrationHelper() {
  const [step, setStep] = useState(1)
  const [selectedOption, setSelectedOption] = useState<string>("current_review")
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)
  const router = useRouter()

  const handleCopyClick = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const results: IllustrationResults = {
    current_review: {
      title: "Current Performance Illustration",
      description: "This report will show exactly how your policy is performing now and in the future",
      items: [
        "Current death benefit amount and type (Level or Increasing)",
        "Projected cash value accumulation year by year",
        "Current premium amount and payment frequency",
        "Current crediting rate/interest rate assumptions",
        "Guaranteed vs. non-guaranteed values",
        "Current loan balance and impact (if applicable)",
        "Policy expenses and charges",
      ],
      script:
        "I am requesting a current in-force illustration that shows the policy performance maintaining the current annual premium. Please include both guaranteed and non-guaranteed values, current cash value projections, and death benefit projections. We need to see all policy expenses and current crediting rate assumptions. Please run this to age 95. If there are any current loans on the policy, please show their impact on the projections.",
    },
    lower_premium: {
      title: "Minimum Premium Illustration",
      description: "This report will show options for maintaining coverage with lower payments",
      items: [
        "Minimum required premium to maintain coverage",
        "Year-by-year breakdown of minimum premium amounts",
        "Impact on cash value accumulation",
        "Death benefit projections at minimum funding",
        "Policy expense impact at minimum funding",
        "Any potential risks of minimum funding",
      ],
      script:
        "I am requesting a minimum premium in-force illustration. Please calculate the lowest possible premium amount needed to maintain the current death benefit until age 95. The illustration should show:\n1. The minimum annual premium required each year\n2. How this minimum funding affects the cash value\n3. Both guaranteed and non-guaranteed projections\n4. Any years where the minimum premium might need to be adjusted\nPlease note any assumptions used in calculating these minimums.",
    },
    stop_paying: {
      title: "Zero Premium Illustration",
      description: "This report will show what happens if you stop premium payments now",
      items: [
        "Projected policy performance with no future premiums",
        "Year-by-year cash value erosion",
        "Projected year of policy lapse (if applicable)",
        "Death benefit duration without premium",
        "Impact on policy riders or benefits",
        "Required cash value to sustain coverage",
      ],
      script:
        "I am requesting a zero-premium in-force illustration. I need to see what happens if all premium payments stop immediately. Specifically, please show:\n1. How long the current death benefit can remain in force\n2. The year-by-year impact on cash value\n3. When the policy would lapse without additional premiums\n4. Both guaranteed and non-guaranteed scenarios\n5. Any impact on existing riders or benefits\nPlease project this to age 95 or until lapse, whichever comes first.",
    },
  }

 const features: FeatureCardProps[] = [
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: "Step 1: Pick Your Question",
      description: `• "How is my policy really doing?"\n• Can I lower my payments?"\n• "What if I stop paying?"`,
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Step 2: Get Request Script",
      description: `• We provide the exact words\n• Different script for each need\n• Insurance company knows what to send`,
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Step 3: Follow Simple Steps",
      description: `• Find your policy number\n• Choose how to contact insurer\n• Get document in 3-5 days`,
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Quick Results",
      description: "Your policy illustration arrives in 3-5 business days",
    },
  ]

  const options = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "See how my policy is doing",
      description: "Check current performance and future outlook",
      value: "current_review",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Find ways to lower my payments",
      description: "Explore options to reduce premiums",
      value: "lower_premium",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "See what happens if I stop paying",
      description: "Understand my options without more payments",
      value: "stop_paying",
    },
  ]

  const steps: Step[] = [
    {
      title: "Locate your policy number",
      description: "Find this on your policy documents or statements",
    },
    {
      title: "Choose how to contact your insurance company",
      description: [
        "Call: Use the phone number on your policy or statement",
        "Email: Contact your agent or the service department",
        "Online: Log into your insurance company's website",
      ],
    },
    {
      title: "Use our request script",
      description: "Copy the script above for your request",
    },
    {
      title: "What to expect",
      description: "Your illustration should arrive within 3-5 business days",
    },
  ]

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
    setStep(3)
  }

  if (step === 1) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ProgressSteps currentStep={1} />

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">How to Get Your Policy Illustration</h1>
          <p className="text-xl text-gray-600 mb-4">Get the in-force illustration you need for your AI analysis</p>
          <p className="text-gray-600 max-w-3xl mx-auto">
           Tell us what's on your mind about your policy, and we'll help you get the right in-force illustration.
          </p>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        <div className="flex flex-col items-center gap-4">
          <Button onClick={() => setStep(2)} className="bg-[#4B6FEE] hover:bg-[#4B6FEE]/90 text-white">
            Start Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => router.push("/")}>
            <Home className="h-4 w-4" /> Return to Home
          </Button>
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ProgressSteps currentStep={2} />

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">What do you want to know about your policy?</h1>
          <p className="text-xl text-gray-600">We&apos;ll help you request exactly what you need</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {options.map((option, index) => (
            <OptionCard key={index} {...option} onClick={() => handleOptionSelect(option.value)} />
          ))}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" className="gap-2" onClick={() => setStep(1)}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => router.push("/")}>
            <Home className="h-4 w-4" /> Return to Home
          </Button>
        </div>
      </div>
    )
  }

  // Step 3: The detailed illustration helper UI
  const content = results[selectedOption]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <ProgressSteps currentStep={3} />

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3">{content.title}</h1>
        <p className="text-xl text-gray-600">{content.description}</p>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="what-youll-see" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 h-12 items-center bg-gray-100 p-1 rounded-lg">
            <TabsTrigger
              value="what-youll-see"
              className="rounded-md h-10 data-[state=active]:bg-white data-[state=active]:text-[#4B6FEE] data-[state=active]:shadow-sm"
            >
              What You&apos;ll See
            </TabsTrigger>
            <TabsTrigger
              value="request-script"
              className="rounded-md h-10 data-[state=active]:bg-white data-[state=active]:text-[#4B6FEE] data-[state=active]:shadow-sm"
            >
              Request Script
            </TabsTrigger>
            <TabsTrigger
              value="next-steps"
              className="rounded-md h-10 data-[state=active]:bg-white data-[state=active]:text-[#4B6FEE] data-[state=active]:shadow-sm"
            >
              Next Steps
            </TabsTrigger>
          </TabsList>

          <TabsContent value="what-youll-see" className="mt-0">
            <ul className="space-y-4" role="list">
              {content.items.map((item, index) => (
                <li key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="h-2 w-2 rounded-full bg-[#4B6FEE] mt-2 shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="request-script" className="mt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-700">
                  Copy this script when contacting your insurance company:
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "gap-2 transition-colors",
                    copySuccess && "bg-[#4B6FEE] text-white hover:bg-[#4B6FEE]/90",
                  )}
                  onClick={() => handleCopyClick(content.script)}
                >
                  {copySuccess ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copySuccess ? "Copied!" : "Copy"}
                </Button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
                <p className="whitespace-pre-line">{content.script}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="next-steps" className="mt-0">
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <button
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4B6FEE] text-white">
                      {index + 1}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">Step {index + 1}:</div>
                      <div className="font-medium">{step.title}</div>
                    </div>
                    {expandedStep === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  {expandedStep === index && (
                    <div className="px-4 pb-4 pl-16 text-gray-600">
                      {Array.isArray(step.description) ? (
                        <ul className="space-y-2">
                          {step.description.map((item, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-[#4B6FEE]" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>{step.description}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <div className="flex justify-between mt-8">
        <Button variant="outline" className="gap-2" onClick={() => setStep(2)}>
          <ArrowLeft className="h-4 w-4" /> Back to Options
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => router.push("/")}>
          <Home className="h-4 w-4" /> Return to Home
        </Button>
      </div>
    </div>
  )
}


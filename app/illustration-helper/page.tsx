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
  script?: boolean
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
    <div className="flex flex-col items-start p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#4B6FEE]/10 text-[#4B6FEE] mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

interface OptionCardProps {
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
  value: string
}

function OptionCard({ icon, title, description, onClick, value }: OptionCardProps) {
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
      title: "Current Policy Illustration",
      description: "See exactly where your policy stands today and in years ahead",
      items: [
        "Your coverage amount and type (Level or Increasing)",
        "Year-by-year projected cash value growth",
        "Your current premium and payment schedule",
        "Current interest rates and growth assumptions",
        "Guaranteed and potential future values",
        "Policy loan details (if you have any)",
        "All policy costs and charges",
      ],
      script:
        "I am requesting a current in-force illustration for my policy. Please include:\n\n• Policy performance based on my current annual premium\n• Both guaranteed and non-guaranteed values\n• Cash value projections\n• Death benefit projections\n• All policy expenses and fees\n• Current interest rate assumptions\n• Projections to age 95\n• Impact of any existing policy loans\n\nPlease make sure all values and projections match my current premium payment schedule.",
    },
    lower_premium: {
      title: "Lower Premium Illustration",
      description: "See how reducing your premium affects your policy",
      items: [
        "Your lowest possible premium to keep coverage",
        "How your payments could change year by year",
        "What happens to your policy's cash value",
        "How your coverage amount may change",
        "All costs and fees at lower funding",
        "Important considerations and trade-offs",
      ],
      script:
        "I am requesting a minimum premium in-force illustration for my policy. Please include:\n\n• The lowest premium amount needed to maintain my current death benefit\n• Year-by-year minimum premium requirements\n• Impact on cash value at minimum funding\n• Both guaranteed and non-guaranteed values\n• All policy expenses and fees\n• Current interest rate assumptions\n• Projections to age 95\n• Any years requiring premium adjustments\n\nPlease note all assumptions used in these calculations.",
    },
    stop_paying: {
      title: "Zero Premium Illustration",
      description: "See exactly how long your policy can last without more payments",
      items: [
        "How your policy performs without future payments",
        "Year-by-year changes to your policy's cash value",
        "When your coverage might end (if it does)",
        "How long your death benefit lasts",
        "Changes to your policy's extra benefits",
        "Cash value needed to keep coverage going",
      ],
      script:
        "I am requesting a zero-premium in-force illustration for my policy. Please show what happens if I stop all premium payments now. Please include:\n\n• How long my current death benefit can continue\n• Year-by-year changes to the cash value\n• When the policy would end without more payments\n• Both guaranteed and non-guaranteed projections\n• Effects on any policy benefits or riders\n• All policy expenses and fees\n• Current interest rate assumptions\n\nPlease run this to age 95 or until the policy ends, whichever comes first.",
    },
  }

  const features: FeatureCardProps[] = [
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "First: Tell Us What You Need",
      description: "We'll help you get the right illustration from three simple options",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Then: Get Your Request Script",
      description: "We'll give you the exact words to use with your insurance company",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Finally: Follow Our Guide",
      description: "We'll walk you through submitting your request using your policy number",
    },
  ]

  const options = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "See how my policy is performing",
      description: "Get a complete picture of your policy's health and future",
      value: "current_review",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Find ways to lower my payments",
      description: "Discover ways to make your payments more affordable",
      value: "lower_premium",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "See what happens if I stop paying",
      description: "Learn what happens to your coverage if payments stop",
      value: "stop_paying",
    },
  ]

  const steps: Step[] = [
    {
      title: "Find Your Policy Number",
      description: "Look for this on your policy statement or online account",
    },
    {
      title: "Contact Your Insurance Company",
      description: [
        "Call: Use the phone number on your policy or statement",
        "Email: Contact your agent or the service department",
        "Online: Log into your insurance company's website",
      ],
    },
    {
      title: "Request Your Illustration",
      description: "Use this script when contacting your insurance company:",
      script: true,
    },
    {
      title: "What to expect",
      description: [
        "Expect your illustration within 3-5 business days",
        "You'll receive it by email or mail",
        "Once you have it, return here to upload",
      ],
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
          <p className="text-xl text-gray-600 mb-4">
            We&apos;ll help you get the illustration needed for your AI analysis
          </p>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Tell us what matters to you, and we&apos;ll help you get the right illustration.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
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
          <h1 className="text-4xl font-bold mb-3">Which Type of Illustration Do You Need?</h1>
          <p className="text-xl text-gray-600">Tell us what you want to learn about your policy</p>
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
              <h3 className="text-lg font-medium text-gray-700">
                Use this script when contacting your insurance company:
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
                <p className="whitespace-pre-line">{content.script}</p>
              </div>
              <div className="flex items-center justify-end">
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
                      {step.script ? (
                        <>
                          <p className="mb-2">{step.description}</p>
                          <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
                            <p className="whitespace-pre-line">{content.script}</p>
                          </div>
                          <div className="flex items-center justify-end mt-2">
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
                        </>
                      ) : Array.isArray(step.description) ? (
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


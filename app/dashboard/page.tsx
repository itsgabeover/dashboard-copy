"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, ArrowRight } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import type { PolicyDashboard, PolicySection, PolicySections } from "@/types/policy-dashboard"
import { ChatInterface } from "@/components/chat-interface"

// Email verification component
function EmailVerification({ onVerify }: { onVerify: (email: string) => void }) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError("Please enter your email")
      return
    }

    console.log("Attempting query with email:", email)
    try {
      const { data, error: supabaseError } = await supabase
        .from("policy_dashboards")
        .select("*")
        .ilike("email", email.toLowerCase().trim())
        .order("created_at", { ascending: false })

      if (supabaseError) throw supabaseError
      if (!data?.length) {
        setError("No policy analysis found for this email")
        return
      }

      localStorage.setItem("userEmail", email.toLowerCase().trim())
      onVerify(email.toLowerCase().trim())
    } catch (err) {
      setError("Error verifying email. Please try again.")
      console.error("Email verification error:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>View Your Policy Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-2 border rounded"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full">
              View My Policy Review(s)
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// Policy selection component
function PolicySelection({
  policies,
  onSelect,
}: {
  policies: PolicyDashboard[]
  onSelect: (policy: PolicyDashboard) => void
}) {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold text-center mb-6">Select a Policy to Review</h2>
        {policies.map((policy) => (
          <Card
            key={policy.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onSelect(policy)}
          >
            <CardHeader>
              <CardTitle>{policy.policy_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Created: {new Date(policy.created_at).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

const tabStructure = [
  {
    id: "policyOverview",
    label: "Policy Overview",
    sections: ["policyOverview"],
    chatPrompts: [
      "Break down my policy in simple words",
      "What makes my policy special?",
      "How much protection do I have?",
    ],
    preamble: "Here's what your policy includes:",
    chatTitle: "Questions About Your Policy",
    title: "Your Policy Basics",
  },
  {
    id: "policyPower",
    label: "The Power of Your Policy",
    sections: ["policyPower"],
    chatPrompts: ["How do my payments grow?", "What if I need to skip a payment?", "Tell me about my guarantees"],
    preamble: "Here's how your policy works:",
    chatTitle: "Questions About Your Coverage",
    title: "Your Policy Protection & Growth",
  },
  {
    id: "builtInAdvantages",
    label: "Built-In Advantages",
    sections: ["builtInAdvantages"],
    chatPrompts: ["What if I need money early?", "How safe is my money?", "What's this cash value about?"],
    preamble: "Your policy comes with these helpful extras:",
    chatTitle: "Questions About Your Benefits",
    title: "Your Policy Benefits",
  },
  {
    id: "protectionInsights",
    label: "Protection Insights",
    sections: ["protectionInsights"],
    chatPrompts: [
      "Help me understand my illness benefits",
      "Tell me about policy loans",
      "What happens as I get older?",
    ],
    preamble: "Keep these key points in mind:",
    chatTitle: "Questions About Policy Details",
    title: "Important Things to Know",
  },
  {
    id: "advisorTopics",
    label: "Advisor Topics",
    sections: ["keyTopics"],
    chatPrompts: ["What should worry me?", "What needs watching?", "When do I call my advisor?"],
    preamble: "Topics for your next advisor meeting:",
    chatTitle: "Questions For Your Advisor",
    title: "Review With Your Advisor",
  },
  {
    id: "pathForward",
    label: "Path Forward",
    sections: ["pathForward"],
    chatPrompts: [
      "How do I keep my policy healthy?",
      "What changes should I expect?",
      "Policy management best practices?",
    ],
    preamble: "Steps to keep your policy on track:",
    chatTitle: "Questions About Policy Management",
    title: "Taking Care of Your Policy",
  },
]

export default function Dashboard() {
  const [isVerified, setIsVerified] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [policies, setPolicies] = useState<PolicyDashboard[]>([])
  const [showPolicySelection, setShowPolicySelection] = useState(false)
  const [policyData, setPolicyData] = useState<PolicyDashboard | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("policyOverview")
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const loadPolicies = useCallback(async (email: string) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("policy_dashboards")
        .select("*")
        .ilike("email", email.toLowerCase())
        .order("created_at", { ascending: false })

      if (supabaseError) throw supabaseError

      if (!data?.length) {
        throw new Error("No policies found for this email")
      }

      setPolicies(data)
      setShowPolicySelection(data.length > 1)

      // If only one policy, select it automatically
      if (data.length === 1) {
        setPolicyData(data[0])
      }
    } catch (err) {
      console.error("Error loading policies:", err)
      setError(err instanceof Error ? err.message : "Failed to load policies")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail")
    if (storedEmail) {
      setIsVerified(true)
      setUserEmail(storedEmail)
      loadPolicies(storedEmail)
      localStorage.setItem("chatbotInitialMessage", `User email: ${storedEmail}`)
    } else {
      setIsLoading(false)
    }
  }, [loadPolicies])

  const handleEmailVerify = (email: string) => {
    setUserEmail(email)
    setIsVerified(true)
    loadPolicies(email)
  }

  const handlePolicySelect = (policy: PolicyDashboard) => {
    setPolicyData(policy)
    setShowPolicySelection(false)
    setActiveTab(tabStructure[0].id)
  }

 const handleSendMessage = async (directMessage?: string) => {
    // Use directMessage if provided, otherwise use inputMessage
    const messageToSend = directMessage || inputMessage.trim()
    if (!messageToSend || !policyData) return

    const newMessages = [...chatMessages, { role: "user" as const, content: messageToSend }]
    setChatMessages(newMessages)
    
    // Only clear input if it wasn't a direct message
    if (!directMessage) {
      setInputMessage("")
    }
    
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": userEmail,
        },
        body: JSON.stringify({
          content: messageToSend,
          session_id: policyData.session_id,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const reader = response.body?.getReader()
      let assistantMessage = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const text = new TextDecoder().decode(value)
          assistantMessage += text

          setChatMessages([...newMessages, { role: "assistant", content: assistantMessage }])
        }
      }
    } catch (error) {
      console.error("Chat error:", error)
      setChatMessages([...newMessages, { role: "assistant", content: "Sorry, I couldn't process your request." }])
    } finally {
      setIsTyping(false)
    }
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Skeleton className="h-32 w-32" />
      </div>
    )
  }

  // Show email verification if not verified
  if (!isVerified) {
    return <EmailVerification onVerify={handleEmailVerify} />
  }

  // Show policy selection if multiple policies
  if (showPolicySelection && policies.length > 1) {
    return <PolicySelection policies={policies} onSelect={handlePolicySelect} />
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  // Main dashboard UI
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 space-y-8 max-w-7xl">
        <header className="text-center mb-8 bg-white p-6 rounded-xl shadow-sm">
          <h1 className="text-4xl font-bold mb-2 text-[rgb(82,102,255)]">
            {policyData?.analysis_data.data?.policyOverview.productName || "Your Policy"}
          </h1>
          <p className="text-xl text-gray-600">
            {policyData?.analysis_data.data?.policyOverview.issuer || "Insurance Carrier"}
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start mb-6 flex flex-wrap gap-2">
            {tabStructure.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex-1 py-3 px-4 rounded-lg transition-all duration-200 ease-in-out bg-white shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-[rgb(82,102,255)] focus:outline-none"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabStructure.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="space-y-6">
              {tab.sections.map((sectionId) => (
                <div key={sectionId}>
                  {isLoading || !policyData?.analysis_data.data
                    ? renderSkeletonContent()
                    : renderSectionContent(
                        policyData.analysis_data.data.sections[sectionId as keyof PolicySections],
                        tab,
                      )}
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>

        {/* Chat Section */}
        <ChatInterface
          messages={chatMessages}
          inputMessage={inputMessage}
          isTyping={isTyping}
          onInputChange={setInputMessage}
          onSendMessage={handleSendMessage}
          onStartNewChat={() => setChatMessages([])}
          quickPrompts={tabStructure.find((tab) => tab.id === activeTab)?.chatPrompts || []}
          chatTitle={tabStructure.find((tab) => tab.id === activeTab)?.chatTitle || "Chat"}
        />
      </div>
    </div>
  )
}

const renderSectionContent = (section: PolicySection, tabData: (typeof tabStructure)[0]) => (
  <Card className="bg-white rounded-xl shadow-sm border-0 ring-1 ring-gray-200 mb-6">
    <CardHeader className="pb-2 border-b">
      <CardTitle className="text-xl font-semibold text-gray-900">{tabData.title}</CardTitle>
    </CardHeader>
    <CardContent className="p-6">
      <div className="space-y-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h4 className="font-semibold mb-2">{tabData.preamble}</h4>
          <ul className="space-y-2">
            {section.bullets.map((bullet, index) => (
              <li key={index} className="flex items-start">
                <ArrowRight className="w-4 h-4 mr-2 mt-1 text-[rgb(82,102,255)]" />
                <div>
                  <span className="font-medium">{bullet.title}: </span>
                  <span>{bullet.content}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </CardContent>
  </Card>
)

const renderSkeletonContent = () => (
  <Card className="bg-white rounded-xl shadow-sm border-0 ring-1 ring-gray-200 mb-6">
    <CardHeader className="pb-2 border-b">
      <Skeleton className="h-6 w-2/3" />
    </CardHeader>
    <CardContent className="p-6">
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
)


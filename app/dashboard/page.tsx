"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, ArrowRight, ChevronDown, ChevronUp } from "lucide-react"
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

const tabStructure: Array<{
  id: string
  label: string
  sections: string[]
  chatPrompts: string[]
  chatTitle: string
  chatSubtext: string
  title: string
}> = [
  {
    id: "policyOverview",
    label: "Your Quick Look",
    sections: ["policyOverview"],
    chatPrompts: [
      "Break down my policy in simple words",
      "What makes my policy special?",
      "How much protection do I have?",
    ],
    chatTitle: "Hi! I'm here to help explain anything you'd like to know more about.",
    chatSubtext: "Have questions about your policy? I'm here to help!",
    title: "Understanding Your Policy",
  },
  {
    id: "policyPower",
    label: "How Your Policy Works",
    sections: ["policyPower"],
    chatPrompts: ["How do my payments grow?", "What if I need to skip a payment?", "Tell me about my guarantees"],
    chatTitle: "Let me explain any part of your policy in more detail.",
    chatSubtext: "Would you like me to explain how your policy works?",
    title: "Making Sense of Your Coverage",
  },
  {
    id: "builtInAdvantages",
    label: "What Your Policy Includes",
    sections: ["builtInAdvantages"],
    chatPrompts: ["What if I need money early?", "How safe is my money?", "What's this cash value about?"],
    chatTitle: "I can help you understand all the ways your policy helps protect you.",
    chatSubtext: "Want to learn more about your policy benefits?",
    title: "Your Policy's Special Features",
  },
  {
    id: "protectionInsights",
    label: "How Your Coverage Works",
    sections: ["protectionInsights"],
    chatPrompts: [
      "Help me understand my illness benefits",
      "Tell me about policy loans",
      "What happens as I get older?",
    ],
    chatTitle: "I can explain how to keep your protection strong.",
    chatSubtext: "Need help understanding how your coverage stays strong?",
    title: "Keeping Your Policy Strong",
  },
  {
    id: "advisorTopics",
    label: "Talk With Your Advisor",
    sections: ["keyTopics"],
    chatPrompts: ["What should worry me?", "What needs watching?", "When do I call my advisor?"],
    chatTitle: "I can help you get ready for your next advisor conversation.",
    chatSubtext: "Would you like help preparing for your advisor meeting?",
    title: "Topics For Your Next Review",
  },
  {
    id: "pathForward",
    label: "Your Next Steps",
    sections: ["pathForward"],
    chatPrompts: [
      "How do I keep my policy healthy?",
      "What changes should I expect?",
      "Policy management best practices?",
    ],
    chatTitle: "I can walk you through exactly what to do next.",
    chatSubtext: "Ready to get started? Let me show you what to do next!",
    title: "Keeping Your Policy on Track",
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
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
    setPolicyData(policy)
    setShowPolicySelection(false)
    setActiveTab(tabStructure[0].id)
  }

  const handleSendMessage = async (directMessage?: string) => {
    const messageToSend = directMessage || inputMessage.trim()
    if (!messageToSend || !policyData) return

    const newMessages = [...chatMessages, { role: "user" as const, content: messageToSend }]
    setChatMessages(newMessages)

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

  const contentSectionRef = useRef<HTMLDivElement>(null)
  const chatSectionRef = useRef<HTMLDivElement>(null)

  const scrollToChat = () => {
    chatSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToContent = () => {
    contentSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Skeleton className="h-32 w-32" />
      </div>
    )
  }

  if (!isVerified) {
    return <EmailVerification onVerify={handleEmailVerify} />
  }

  if (showPolicySelection && policies.length > 1) {
    return <PolicySelection policies={policies} onSelect={handlePolicySelect} />
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 space-y-8 max-w-7xl">
        <header className="text-center mb-8 bg-white p-6 rounded-xl shadow-sm">
          {policyData && policyData.analysis_data.data.policyOverview && (
            <>
              <h1 className="text-3xl font-bold mb-2 text-[rgb(82,102,255)]">
                {policyData.analysis_data.data.policyOverview.productName || "Policy Overview"}
              </h1>
              <h2 className="text-xl text-gray-600">{policyData.analysis_data.data.policyOverview.issuer || ""}</h2>
            </>
          )}
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start mb-6 flex flex-wrap gap-2">
            {tabStructure.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex-1 py-3 px-4 rounded-lg transition-all duration-200 ease-in-out bg-white shadow-sm hover:bg-gray-50 data-[state=active]:bg-[rgb(82,102,255)] data-[state=active]:text-white focus:ring-2 focus:ring-[rgb(82,102,255)] focus:outline-none"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabStructure.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="space-y-0">
              {/* Content Section (Area 1) */}
              <div
                ref={contentSectionRef}
                className="bg-white rounded-xl shadow-sm p-6 mb-24 min-h-screen flex flex-col"
              >
                <div className="space-y-6">
                  {tab.sections.map((sectionId) => {
                    const section = policyData?.analysis_data.data.sections[sectionId as keyof PolicySections]
                    return (
                      <div key={sectionId}>
                        {isLoading || !section ? renderSkeletonContent() : renderSectionContent(section, tab)}
                      </div>
                    )
                  })}
                  <div className="mt-auto pt-8 flex flex-col items-center">
                    <p className="text-center mb-2 text-gray-600">{tab.chatSubtext}</p>
                    <Button
                      onClick={scrollToChat}
                      className="group flex items-center gap-2 bg-[rgb(82,102,255)] text-white hover:bg-[rgb(82,102,255)]/90 transition-all duration-300"
                    >
                      Chat With Your AI Helper
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Chat Section (Area 2) */}
              <div ref={chatSectionRef} className="relative bg-white rounded-xl shadow-sm min-h-screen mt-24 pb-24">
                <Button
                  onClick={scrollToContent}
                  className="absolute -top-4 right-4 z-10 bg-[rgb(82,102,255)] text-white hover:bg-[rgb(82,102,255)]/90 rounded-full shadow-md"
                  size="icon"
                >
                  <ChevronUp className="w-4 h-4" />
                  <span className="sr-only">Return to top</span>
                </Button>
                <div className="p-6 h-full">
                  <ChatInterface
                    messages={chatMessages}
                    inputMessage={inputMessage}
                    isTyping={isTyping}
                    onInputChange={setInputMessage}
                    onSendMessage={handleSendMessage}
                    onStartNewChat={() => setChatMessages([])}
                    quickPrompts={tab.chatPrompts}
                    chatTitle={tab.chatTitle}
                    chatSubtext=""
                  />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
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
        {section.opening && (
          <p className="text-gray-700">
            {tabData.id === "policyOverview"
              ? `Let's walk through your life insurance policy in simple terms. ${section.opening}`
              : tabData.id === "policyPower"
                ? "Your life insurance policy works for you in several important ways. Let's break down how it protects your family while giving you flexibility for the future."
                : tabData.id === "builtInAdvantages"
                  ? "Your life insurance comes with valuable extras built right in. Here's how these features work for you and your family when you need them."
                  : tabData.id === "protectionInsights"
                    ? "Let's look at what keeps your life insurance solid and dependable. Understanding these points helps you get the most from your coverage."
                    : tabData.id === "advisorTopics"
                      ? "Your advisor helps make sure your life insurance stays aligned with your goals. Here are key points to discuss at your next meeting."
                      : tabData.id === "pathForward"
                        ? "Let's make sure your life insurance stays strong. Here are simple steps you can take to keep everything running smoothly."
                        : section.opening}
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {section.bullets
            .filter((bullet) => !["Product Name", "Carrier Name"].includes(bullet.title))
            .map((bullet, index) => (
              <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1 flex-shrink-0">
                      <div className="rounded-full bg-[rgb(82,102,255)]/10 p-2">
                        <ArrowRight className="h-4 w-4 text-[rgb(82,102,255)]" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-medium text-gray-900">{bullet.title.replace(":", "")}</h3>
                      <p className="text-sm text-gray-600">{bullet.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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


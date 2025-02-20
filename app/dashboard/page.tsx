"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import PDFDownloadButton from "@/components/PDFDownloadButton"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, ArrowRight, ChevronDown, ChevronUp, HelpCircle, ArrowUp } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { ChatInterface } from "@/components/chat-interface"
import { MobileTabsNavigation } from "@/components/MobileTabsNavigation"
import { MobileCardGrid } from "@/components/MobileCardGrid"

interface PolicyDashboard {
  id: string
  policy_name: string
  created_at: string
  session_id: string
  analysis_data: {
    data: {
      policyOverview: {
        productName: string
        issuer: string
      }
      sections: {
        [key: string]: PolicySection
      }
    }
  }
}

interface PolicySection {
  opening: string
  bullets: Array<{
    title: string
    content: string
  }>
}

interface PolicySections {
  [key: string]: PolicySection
}

const tabStructure = [
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
    label: "Smart Policy Care",
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

function EmailVerification({ onVerify }: { onVerify: (email: string) => void }) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError("Please enter your email")
      return
    }

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
  const [isChatOpen, setIsChatOpen] = useState(false)

  const contentSectionRef = useRef<HTMLDivElement>(null)

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

  const renderSectionContent = (section: PolicySection, tab: (typeof tabStructure)[0]) => (
    <Card className="bg-white rounded-xl shadow-sm border-0 ring-1 ring-gray-200 mb-3">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-xl font-semibold text-gray-900">{tab.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-3">
          {section.opening && (
            <p className="text-gray-700 pl-4">
              {tab.id === "policyOverview"
                ? `Let's walk through your life insurance policy in simple terms. ${section.opening}`
                : tab.id === "policyPower"
                  ? "Your life insurance policy works for you in several important ways. Let's break down how it protects your family while giving you flexibility for the future."
                  : tab.id === "builtInAdvantages"
                    ? "Your life insurance comes with valuable extras built right in. Here's how these features work for you and your family when you need them."
                    : tab.id === "protectionInsights"
                      ? "Let's look at what keeps your life insurance solid and dependable. Understanding these points helps you get the most from your coverage."
                      : tab.id === "advisorTopics"
                        ? "Your advisor helps make sure your life insurance stays aligned with your goals. Here are key points to discuss at your next meeting."
                        : tab.id === "pathForward"
                          ? "Let's make sure your life insurance stays strong. Here are simple steps you can take to keep everything running smoothly."
                          : section.opening}
            </p>
          )}
          <div className="md:hidden">
            <MobileCardGrid
              items={section.bullets.filter(
                (bullet) => !["productName", "issuer", "Value Growth"].includes(bullet.title),
              )}
            />
          </div>
          <div className="hidden md:grid md:grid-cols-2 gap-3">
            {section.bullets
              .filter((bullet) => !["productName", "issuer", "Value Growth"].includes(bullet.title))
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 space-y-8 max-w-7xl">
        <header className="text-center mb-8 bg-white p-6 rounded-xl shadow-sm">
          {policyData && policyData.analysis_data.data.policyOverview && (
            <>
              <h1 className="text-3xl font-bold mb-2 text-[rgb(82,102,255)]">
                Your {policyData.analysis_data.data.policyOverview.productName || "Policy Overview"} Policy
              </h1>
              <h2 className="text-xl text-gray-600">{policyData.analysis_data.data.policyOverview.issuer || ""}</h2>
            </>
          )}
        </header>

        <div className="md:hidden mb-4">
          <MobileTabsNavigation tabs={tabStructure} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start mb-6 hidden md:flex flex-wrap gap-2">
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
            <TabsContent key={tab.id} value={tab.id} className="space-y-20">
              {/* Content Section (Area 1) */}
              <div ref={contentSectionRef} className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="space-y-3">
                  {tab.sections.map((sectionId) => {
                    const section = policyData?.analysis_data.data.sections[sectionId as keyof PolicySections]
                    return (
                      <div key={sectionId}>
                        {isLoading || !section ? renderSkeletonContent() : renderSectionContent(section, tab)}
                      </div>
                    )
                  })}
                </div>

                {/* Expandable Chat Section */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <HelpCircle className="w-5 h-5 text-[rgb(82,102,255)]" />
                      <span className="text-sm">{tab.chatSubtext}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        className="group flex items-center space-x-2 border-[rgb(82,102,255)] text-[rgb(82,102,255)] hover:bg-[rgb(82,102,255)] hover:text-white transition-all duration-300"
                        onClick={() => {
                          setIsChatOpen(!isChatOpen)
                          if (!isChatOpen) {
                            setTimeout(() => {
                              const chatElement = document.querySelector(".mt-6.pt-6.border-t")
                              if (chatElement) {
                                const elementPosition = chatElement.getBoundingClientRect().top
                                const offsetPosition = elementPosition + window.pageYOffset - 100
                                window.scrollTo({
                                  top: offsetPosition,
                                  behavior: "smooth",
                                })
                              }
                            }, 100)
                          }
                        }}
                      >
                        <span>{isChatOpen ? "Close Chat" : "Start Chat"}</span>
                        {isChatOpen ? (
                          <ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-1" />
                        ) : (
                          <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center space-x-2 border-[rgb(82,102,255)] text-[rgb(82,102,255)] hover:bg-[rgb(82,102,255)] hover:text-white transition-all duration-300"
                        onClick={scrollToTop}
                      >
                        <ArrowUp className="w-4 h-4" />
                        <span className="sr-only">Scroll to Top</span>
                      </Button>
                    </div>
                  </div>

                  {/* Collapsible Chat Interface */}
                  {isChatOpen && (
                    <div className="mt-6">
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
                      {/* Download Button */}
                      {policyData && (
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <PDFDownloadButton sessionId={policyData.session_id} email={userEmail} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}


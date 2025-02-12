"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, ArrowRight, Send } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import type { PolicyDashboard, PolicySection, PolicySections } from "@/types/policy-dashboard"

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
  { id: "overview", label: "Overview", sections: ["policyOverview", "protectionGlance"] },
  { id: "protection", label: "Protection", sections: ["policyPower", "protectionInsights"] },
  { id: "benefits", label: "Benefits", sections: ["builtInAdvantages"] },
  { id: "planning", label: "Planning", sections: ["keyTopics", "pathForward"] },
]

export default function Dashboard() {
  const [isVerified, setIsVerified] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [policies, setPolicies] = useState<PolicyDashboard[]>([])
  const [showPolicySelection, setShowPolicySelection] = useState(false)
  const [policyData, setPolicyData] = useState<PolicyDashboard | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [activeSection, setActiveSection] = useState<keyof PolicySections>("policyOverview")
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [inputMessage, setInputMessage] = useState("")

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
    setActiveSection(tabStructure[0].sections[0] as keyof PolicySections)
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !policyData) return

    const newMessages = [...chatMessages, { role: "user" as const, content: inputMessage }]
    setChatMessages(newMessages)
    setInputMessage("")

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          context: policyData.analysis_data.data.sections[activeSection].opening,
          email: userEmail,
          sessionId: policyData.session_id,
        }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data = await response.json()
      setChatMessages([...newMessages, { role: "assistant", content: data.reply }])
    } catch (error) {
      console.error("Error:", error)
      setChatMessages([...newMessages, { role: "assistant", content: "Sorry, I couldn't process your request." }])
    }
  }

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
            {policyData?.analysis_data.data?.policyOverview.productName}
          </h1>
          <p className="text-xl text-gray-600">{policyData?.analysis_data.data?.policyOverview.issuer}</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start mb-6">
            {tabStructure.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex-1">
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
                    : renderSectionContent(policyData.analysis_data.data.sections[sectionId as keyof PolicySections])}
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>

        {/* Chat Section */}
        <Card className="bg-white rounded-xl shadow-sm border-0 ring-1 ring-gray-200 mt-8">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Chat about {policyData?.analysis_data.data?.sections[activeSection].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-64 overflow-y-auto mb-4 bg-gray-50 rounded-lg p-4">
              {chatMessages.map((message, index) => (
                <div key={index} className={`mb-2 ${message.role === "assistant" ? "text-blue-600" : "text-gray-800"}`}>
                  <strong>{message.role === "assistant" ? "Assistant: " : "You: "}</strong>
                  {message.content}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {policyData?.analysis_data.data?.sections[activeSection].bullets.slice(0, 3).map((bullet, index) => (
                <Button key={index} variant="outline" size="sm" onClick={() => setInputMessage(bullet.title)}>
                  {bullet.title}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[rgb(82,102,255)]"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button
                className="bg-[rgb(82,102,255)] text-white hover:bg-[rgb(82,102,255)]/90"
                onClick={handleSendMessage}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const renderSectionContent = (section: PolicySection) => (
  <Card className="bg-white rounded-xl shadow-sm border-0 ring-1 ring-gray-200 mb-6">
    <CardHeader className="pb-2 border-b">
      <CardTitle className="text-xl font-semibold text-gray-900">{section.title}</CardTitle>
    </CardHeader>
    <CardContent className="p-6">
      <div className="space-y-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h4 className="font-semibold mb-3">Policy Snapshot</h4>
          <p className="text-gray-700 leading-relaxed">{section.opening}</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h4 className="font-semibold mb-3">Key Details</h4>
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


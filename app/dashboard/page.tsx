"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, Send } from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import type { PolicyData, PolicySection } from "@/types/policy-dashboard"

const tabStructure = [
  { id: "overview", label: "Overview", sections: ["policyOverview", "protectionGlance"] },
  { id: "protection", label: "Protection", sections: ["policyPower", "protectionInsights"] },
  { id: "benefits", label: "Benefits", sections: ["builtInAdvantages"] },
  { id: "planning", label: "Planning", sections: ["keyTopics", "pathForward"] },
]

export default function Dashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("overview")
  const [activeSection, setActiveSection] = useState<keyof PolicyData["sections"]>("policyOverview")
  const [isLoading, setIsLoading] = useState(true)
  const [policyData, setPolicyData] = useState<PolicyData | null>(null)
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [inputMessage, setInputMessage] = useState("")

  useEffect(() => {
    const fetchPolicyData = async () => {
      const { data, error } = await supabase.from("policies").select("*").single()

      if (error) {
        console.error("Error fetching policy data:", error)
      } else {
        setPolicyData(data)
      }
      setIsLoading(false)
    }

    fetchPolicyData()
  }, [])

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && tabStructure.some((t) => t.id === tab)) {
      setActiveTab(tab)
      setActiveSection(tabStructure.find((t) => t.id === tab)!.sections[0] as keyof PolicyData["sections"])
    }
  }, [searchParams])

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set("tab", activeTab)
    router.push(`?${newSearchParams.toString()}`, { scroll: false })
  }, [activeTab, router, searchParams])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

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
          context: policyData?.sections[activeSection].opening,
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

  if (!policyData && !isLoading) {
    return <div>Error loading policy data</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 space-y-8 max-w-7xl">
        <header className="text-center mb-8 bg-white p-6 rounded-xl shadow-sm">
          <h1 className="text-4xl font-bold mb-2 text-[rgb(82,102,255)]">{policyData?.policyCore.productName}</h1>
          <p className="text-xl text-gray-600">{policyData?.policyCore.issuer}</p>
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
                  {isLoading || !policyData
                    ? renderSkeletonContent()
                    : renderSectionContent(policyData.sections[sectionId as keyof PolicyData["sections"]])}
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>

        {/* Chat Section */}
        <Card className="bg-white rounded-xl shadow-sm border-0 ring-1 ring-gray-200 mt-8">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Chat about {policyData?.sections[activeSection].title}
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
              {policyData?.sections[activeSection].bullets.slice(0, 3).map((bullet, index) => (
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


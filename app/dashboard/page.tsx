"use client"

import { useState, useEffect, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, Info } from "lucide-react"
import type { ParsedDashboardData, PolicyDashboard } from "@/types/policy-dashboard"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { PolicyChatbot } from "@/components/PolicyChatbot"

// Interfaces adjusted to match policy-dashboard.ts
interface SectionContent {
  id: string
  title: string
  opening: string
  details: string[]
}

interface PolicySectionMapping {
  [key: string]: {
    getOpening: (data: ParsedDashboardData) => string
    getDetails: (data: ParsedDashboardData) => string[]
  }
}

// Data mapping adjusted to match new structure
const sectionMappings: PolicySectionMapping = {
  protection: {
    getOpening: (data) => data.data.sections.policyOverview.opening,
    getDetails: (data) => [
      data.data.sections.protectionGlance.bullets[0].content,
      `${data.data.sections.policyOverview.bullets[0].content} by ${data.data.sections.policyOverview.bullets[1].content}`,
      data.data.sections.policyPower.bullets[0].content,
      data.data.sections.protectionGlance.bullets[4].content,
      data.data.sections.protectionGlance.bullets[0].content,
    ],
  },
  premium: {
    getOpening: () => "Understanding your premium structure and funding requirements",
    getDetails: (data) => [
      data.data.sections.protectionGlance.bullets[1].content,
      data.data.sections.protectionGlance.bullets[2].content,
      data.data.sections.protectionInsights.bullets[0].content,
      data.data.sections.protectionInsights.bullets[1].content,
      data.data.sections.keyTopics.bullets[0].content,
    ],
  },
  growth: {
    getOpening: (data) => data.data.sections.policyPower.opening,
    getDetails: (data) => [
      data.data.sections.policyPower.bullets[1].content,
      data.data.sections.policyPower.bullets[4].content,
      data.data.sections.builtInAdvantages.bullets[3].content,
      data.data.sections.protectionInsights.bullets[3].content,
      data.data.sections.keyTopics.bullets[2].content,
    ],
  },
  benefits: {
    getOpening: (data) => data.data.sections.builtInAdvantages.opening,
    getDetails: (data) => [
      data.data.sections.builtInAdvantages.bullets[0].content,
      data.data.sections.builtInAdvantages.bullets[1].content,
      data.data.sections.builtInAdvantages.bullets[2].content,
      data.data.sections.policyPower.bullets[3].content,
      data.data.sections.builtInAdvantages.bullets[3].content,
    ],
  },
  management: {
    getOpening: (data) => data.data.sections.protectionInsights.opening,
    getDetails: (data) => [
      data.data.sections.protectionInsights.bullets[2].content,
      data.data.sections.pathForward.bullets[0].content,
      data.data.sections.pathForward.bullets[1].content,
      data.data.sections.keyTopics.bullets[2].content,
      data.data.sections.pathForward.bullets[2].content,
    ],
  },
}

const analysisNavigation = [
  { id: "protection", title: "Protection Structure" },
  { id: "premium", title: "Premium & Funding Analysis" },
  { id: "growth", title: "Growth & Value Features" },
  { id: "benefits", title: "Policy Benefits & Riders" },
  { id: "management", title: "Ongoing Policy Management" },
]

const getSectionContent = (sectionId: string, policyData: ParsedDashboardData): SectionContent | null => {
  const mapping = sectionMappings[sectionId]
  if (!mapping) return null

  return {
    id: sectionId,
    title: analysisNavigation.find((nav) => nav.id === sectionId)?.title || "",
    opening: mapping.getOpening(policyData),
    details: mapping.getDetails(policyData),
  }
}

// Helper Components
const EmailVerification = ({ onVerify }: { onVerify: (email: string) => void }) => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!email) {
      setError("Please enter your email")
      return
    }

    const { data, error: supabaseError } = await supabase
      .from("policy_dashboards")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .order("created_at", { ascending: false })

    if (supabaseError || !data?.length) {
      setError("No policy analysis found for this email")
      return
    }

    localStorage.setItem("userEmail", email.toLowerCase().trim())
    onVerify(email)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-[#4361EE]">View Your Policy Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>
          <Button onClick={handleSubmit} className="w-full bg-[#4361EE] text-white hover:bg-[#3651DE]">
            View My Policy Review(s)
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

const PolicySelection = ({
  policies,
  onSelect,
}: {
  policies: PolicyDashboard[]
  onSelect: (policy: PolicyDashboard) => void
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-[#4361EE]">Select a Policy to View</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {policies.map((policy, index) => (
            <button
              key={index}
              onClick={() => onSelect(policy)}
              className="w-full p-4 text-left border rounded-lg hover:border-[#4361EE] transition-colors"
            >
              <div className="font-medium text-[#4361EE]">{policy.policy_name}</div>
              <div className="text-sm text-gray-500">Uploaded: {new Date(policy.created_at).toLocaleDateString()}</div>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

const getHealthDescription = (score: number): string => {
  if (score >= 90) return "Excellent"
  if (score >= 80) return "Very Good"
  if (score >= 70) return "Good"
  if (score >= 60) return "Fair"
  return "Needs Improvement"
}

// Main Dashboard Component
export default function Dashboard() {
  const [policyData, setPolicyData] = useState<ParsedDashboardData | null>(null)
  const [selectedSection, setSelectedSection] = useState<SectionContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [policies, setPolicies] = useState<PolicyDashboard[]>([])
  const [showPolicySelection, setShowPolicySelection] = useState(false)
  const [userEmail, setUserEmail] = useState<string>("")

  const loadPolicies = useCallback(async (email: string) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("policy_dashboards")
        .select("*")
        .eq("email", email.toLowerCase())
        .order("created_at", { ascending: false })

      if (supabaseError) throw supabaseError
      if (!data?.length) throw new Error("No policy data found")

      setPolicies(data as PolicyDashboard[])
      setShowPolicySelection(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching policies")
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

  const handleEmailVerified = (email: string) => {
    setIsVerified(true)
    setUserEmail(email)
    loadPolicies(email)
  }

  const handlePolicySelect = (policy: PolicyDashboard) => {
    setPolicyData(policy.analysis_data)
    setShowPolicySelection(false)
    if (analysisNavigation.length > 0) {
      setSelectedSection(getSectionContent(analysisNavigation[0].id, policy.analysis_data))
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4361EE]"></div>
      </div>
    )
  }

  if (!isVerified) {
    return <EmailVerification onVerify={handleEmailVerified} />
  }

  if (showPolicySelection) {
    return <PolicySelection policies={policies} onSelect={handlePolicySelect} />
  }

  if (error || !policyData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error || "Failed to load policy data"}</p>
              <Button
                onClick={() => {
                  localStorage.removeItem("userEmail")
                  setIsVerified(false)
                  setShowPolicySelection(false)
                }}
                className="bg-[#4361EE] text-white hover:bg-[#3651DE]"
              >
                Try Different Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const healthScore = 85
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 space-y-8 max-w-7xl">
        <header className="text-center mb-8 bg-white p-6 rounded-xl shadow-sm">
          <h1 className="text-4xl font-bold mb-2 text-[rgb(82,102,255)]">
            {policyData.data.policyOverview.productName}
          </h1>
          <p className="text-xl text-gray-600">{policyData.data.policyOverview.issuer}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white border rounded-xl p-1 shadow-sm mb-6">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-[rgb(82,102,255)] data-[state=active]:text-white rounded-lg transition-all"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-[rgb(82,102,255)] data-[state=active]:text-white rounded-lg transition-all"
                >
                  Policy Details
                </TabsTrigger>
                <TabsTrigger
                  value="analysis"
                  className="data-[state=active]:bg-[rgb(82,102,255)] data-[state=active]:text-white rounded-lg transition-all"
                >
                  AI Analysis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white rounded-xl shadow-sm border-0 ring-1 ring-gray-200">
                    <CardHeader className="pb-2 border-b">
                      <CardTitle className="text-xl font-semibold text-gray-900">Policy Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <dl className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <dt className="font-semibold text-gray-700 mb-1">Death Benefit</dt>
                          <dd className="text-2xl text-[rgb(82,102,255)]">
                            {formatCurrency(policyData.data.policyOverview.deathBenefit)}
                          </dd>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <dt className="font-semibold text-gray-700 mb-1">Annual Premium</dt>
                          <dd className="text-2xl text-[rgb(82,102,255)]">
                            {formatCurrency(policyData.data.policyOverview.annualPremium)}
                          </dd>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <dt className="font-semibold text-gray-700 mb-1">Policy Type</dt>
                          <dd className="text-2xl text-[rgb(82,102,255)]">
                            {policyData.data.policyOverview.productType}
                          </dd>
                        </div>
                      </dl>
                      <div className="mt-6 pl-4 border-l-4 border-[rgb(82,102,255)] bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">
                          This policy provides comprehensive coverage tailored to your specific needs. Review the
                          details carefully to understand your benefits and obligations.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white rounded-xl shadow-sm border-0 ring-1 ring-gray-200">
                    <CardHeader className="pb-2 border-b">
                      <CardTitle className="text-xl font-semibold text-gray-900">Policy Health</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center p-6">
                      <div className="text-6xl font-bold mb-2 text-[rgb(82,102,255)]">{healthScore}%</div>
                      <div className="text-2xl font-semibold mb-4 text-gray-700">
                        {getHealthDescription(healthScore)}
                      </div>
                      <div className="w-full h-1 bg-gray-200 mb-4 rounded-full overflow-hidden">
                        <div className="h-full bg-[rgb(82,102,255)]" style={{ width: `${healthScore}%` }} />
                      </div>
                      <Progress value={healthScore} className="w-full h-3 bg-gray-100 rounded-full" />
                      <p className="mt-6 text-sm text-gray-600 text-center bg-blue-50 p-4 rounded-lg border border-blue-100">
                        This health score evaluates your policy&apos;s performance across premium structure, guarantees,
                        cash accumulation, available riders, and flexibility options. Higher scores indicate robust
                        features and stronger long-term value.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-white rounded-xl shadow-sm border-0 ring-1 ring-gray-200">
                  <CardHeader className="pb-2 border-b">
                    <CardTitle className="text-xl font-semibold text-gray-900">Policy Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-lg">
                      {policyData.data.sections.pathForward.opening}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                <Card className="bg-white rounded-xl shadow-sm border-0 ring-1 ring-gray-200">
                  <CardHeader className="pb-2 border-b">
                    <CardTitle className="text-xl font-semibold text-gray-900">Policy Riders</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-3">
                      {policyData.data.sections.builtInAdvantages.bullets.map((bullet, index) => (
                        <li key={index} className="bg-gray-50 p-4 rounded-lg flex items-start">
                          <span className="inline-block w-2 h-2 rounded-full bg-[rgb(82,102,255)] mt-2 mr-3" />
                          <span>{bullet.content}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-xl shadow-sm border-0 ring-1 ring-gray-200">
                  <CardHeader className="pb-2 border-b">
                    <CardTitle className="text-xl font-semibold text-gray-900">Key Policy Details</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {policyData.data.sections.keyTopics.bullets.map((bullet, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-lg">
                          <h4 className="text-lg font-semibold text-[rgb(82,102,255)] mb-4">{bullet.title}</h4>
                          <p>{bullet.content}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
                  <div className="space-y-4">
                    <Card className="bg-white rounded-xl shadow-sm border-0 ring-1 ring-gray-200">
                      <CardHeader className="pb-2 border-b">
                        <CardTitle className="text-xl font-semibold text-gray-900">Policy Sections</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          {analysisNavigation.map((section) => (
                            <button
                              key={section.id}
                              onClick={() => setSelectedSection(getSectionContent(section.id, policyData))}
                              className={cn(
                                "w-full flex items-center justify-between px-4 py-3 text-left transition-all rounded-lg hover:bg-gray-50",
                                selectedSection?.id === section.id &&
                                  "bg-[rgb(82,102,255)] text-white hover:bg-[rgb(82,102,255)] shadow-md",
                              )}
                            >
                              <span>{section.title}</span>
                              <ChevronRight
                                className={cn(
                                  "w-4 h-4 transition-transform",
                                  selectedSection?.id === section.id && "rotate-90",
                                )}
                              />
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex gap-2 text-sm text-blue-700">
                        <Info className="w-4 h-4 mt-0.5" />
                        <p>Click on a section to view detailed analysis and insights</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {selectedSection ? (
                      <>
                        <Card className="bg-white rounded-xl shadow-sm border-0 ring-1 ring-gray-200">
                          <CardHeader className="pb-2 border-b">
                            <CardTitle className="text-xl font-semibold text-gray-900">
                              {selectedSection.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-6">
                            <div className="space-y-6">
                              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                                <h4 className="font-semibold mb-3">Overview</h4>
                                <p className="text-gray-700 leading-relaxed">{selectedSection.opening}</p>
                              </div>

                              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <h4 className="font-semibold mb-3">Key Details</h4>
                                <ul className="space-y-2">
                                  {selectedSection.details.map((detail, index) => (
                                    <li key={index} className="flex items-start">
                                      <span className="inline-block w-2 h-2 rounded-full bg-[rgb(82,102,255)] mt-2 mr-3" />
                                      <span>{detail}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Select a policy section to view analysis</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="lg:col-span-1">
            <PolicyChatbot sessionId={policyData.sessionId} userEmail={userEmail} />
          </div>
        </div>
      </div>
    </div>
  )
}


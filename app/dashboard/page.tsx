"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Lightbulb, Flag, ChevronRight } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { supabase } from "@/lib/supabase"
import { PolicyChatbot } from "@/components/PolicyChatbot"
import { cn, formatCurrency } from "@/lib/utils"

// Types
interface PolicyValue {
  timePoint: string
  values: {
    cashValue: number
    netSurrenderValue: number
    deathBenefitAmount: number
  }
}

interface PolicySection {
  title: string
  hiddengem: string
  blindspot: string
  redflag: string
  clientImplications: string
  quotes: string[]
}

interface PolicyOverview {
  productName: string
  issuer: string
  deathBenefit: number
  annualPremium: number
  productType: string
  riders: string[]
}

interface PolicyData {
  data: {
    policyOverview: PolicyOverview
    sections: PolicySection[]
    values: PolicyValue[]
    finalThoughts: string
  }
}

interface Policy {
  id: string
  created_at: string
  policy_name: string
  analysis_data: PolicyData
  email: string
  session_id: string
}

// Helper Components
const EmailVerification = ({ onVerify }: { onVerify: (email: string) => void }) => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email) {
      setError("Please enter your email")
      return
    }

    setLoading(true)
    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase().trim(),
      })
      if (authError) throw authError

      const { data, error: policiesError } = await supabase
        .from("policies")
        .select("*")
        .eq("email", email.toLowerCase().trim())
        .order("created_at", { ascending: false })

      if (policiesError || !data?.length) {
        setError("No policy analysis found for this email")
        return
      }

      localStorage.setItem("userEmail", email.toLowerCase().trim())
      onVerify(email)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
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
              disabled={loading}
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full bg-[#4361EE] text-white hover:bg-[#3651DE]"
            disabled={loading}
          >
            {loading ? "Verifying..." : "View My Policy Review(s)"}
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
  policies: Policy[]
  onSelect: (policy: Policy) => void
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-[#4361EE]">Select a Policy to View</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {policies.map((policy) => (
            <button
              key={policy.id}
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

// Main Dashboard Component
export default function Dashboard() {
  const router = useRouter()
  const [policyData, setPolicyData] = useState<PolicyData | null>(null)
  const [selectedSection, setSelectedSection] = useState<PolicySection | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [policies, setPolicies] = useState<Policy[]>([])
  const [showPolicySelection, setShowPolicySelection] = useState(false)
  const [userEmail, setUserEmail] = useState<string>("")

  const loadPolicies = useCallback(
    async (email: string) => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionError || !sessionData.session) {
          router.push("/auth")
          return
        }

        const { data, error: policiesError } = await supabase
          .from("policies")
          .select("*")
          .eq("email", email.toLowerCase())
          .order("created_at", { ascending: false })

        if (policiesError) throw policiesError
        if (!data?.length) throw new Error("No policy data found")

        setPolicies(data as Policy[])
        setShowPolicySelection(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred while fetching policies")
      } finally {
        setIsLoading(false)
      }
    },
    [router],
  )

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail")
    if (storedEmail) {
      setIsVerified(true)
      setUserEmail(storedEmail)
      loadPolicies(storedEmail)
    } else {
      setIsLoading(false)
    }

    // Setup Supabase auth listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        localStorage.removeItem("userEmail")
        setIsVerified(false)
        router.push("/auth")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [loadPolicies, router])

  const handleEmailVerified = (email: string) => {
    setIsVerified(true)
    setUserEmail(email)
    loadPolicies(email)
  }

  const handlePolicySelect = (policy: Policy) => {
    setPolicyData(policy.analysis_data)
    setShowPolicySelection(false)
    if (policy.analysis_data.data.sections?.length > 0) {
      setSelectedSection(policy.analysis_data.data.sections[0])
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem("userEmail")
    setIsVerified(false)
    router.push("/auth")
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

  const healthScore = 85 // This would typically be calculated based on policy metrics

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 space-y-8 max-w-7xl">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
          <div>
            <h1 className="text-4xl font-bold text-[#4361EE]">{policyData.data.policyOverview.productName}</h1>
            <p className="text-xl text-gray-600">{policyData.data.policyOverview.issuer}</p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </header>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white border rounded-xl p-1 shadow-sm mb-6">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-[#4361EE] data-[state=active]:text-white rounded-lg transition-all"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-[#4361EE] data-[state=active]:text-white rounded-lg transition-all"
            >
              Policy Details
            </TabsTrigger>
            <TabsTrigger
              value="analysis"
              className="data-[state=active]:bg-[#4361EE] data-[state=active]:text-white rounded-lg transition-all"
            >
              AI Analysis
            </TabsTrigger>
            <TabsTrigger
              value="projections"
              className="data-[state=active]:bg-[#4361EE] data-[state=active]:text-white rounded-lg transition-all"
            >
              Projections
            </TabsTrigger>
            <TabsTrigger
              value="chatbot"
              className="data-[state=active]:bg-[#4361EE] data-[state=active]:text-white rounded-lg transition-all"
            >
              AI Assistant
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle>Policy Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <dt className="font-semibold text-gray-700">Death Benefit</dt>
                      <dd className="text-2xl text-[#4361EE]">
                        {formatCurrency(policyData.data.policyOverview.deathBenefit)}
                      </dd>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <dt className="font-semibold text-gray-700">Annual Premium</dt>
                      <dd className="text-2xl text-[#4361EE]">
                        {formatCurrency(policyData.data.policyOverview.annualPremium)}
                      </dd>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <dt className="font-semibold text-gray-700">Policy Type</dt>
                      <dd className="text-2xl text-[#4361EE]">{policyData.data.policyOverview.productType}</dd>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle>Policy Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="text-6xl font-bold text-[#4361EE]">{healthScore}%</div>
                    <Progress value={healthScore} className="h-2" />
                    <p className="text-sm text-gray-600">
                      This score evaluates your policy&apos;s overall health based on multiple factors
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle>Policy Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{policyData.data.finalThoughts}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <Card className="bg-white rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle>Policy Riders</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {policyData.data.policyOverview.riders.map((rider, index) => (
                    <li key={index} className="bg-gray-50 p-4 rounded-lg">
                      {rider}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle>Value Projections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {policyData.data.values.map((timePoint, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-[#4361EE] mb-4">{timePoint.timePoint}</h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-600">Cash Value</p>
                          <p className="text-lg font-semibold">{formatCurrency(timePoint.values.cashValue)}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-600">Net Surrender Value</p>
                          <p className="text-lg font-semibold">{formatCurrency(timePoint.values.netSurrenderValue)}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-600">Death Benefit</p>
                          <p className="text-lg font-semibold">{formatCurrency(timePoint.values.deathBenefitAmount)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
              <div className="space-y-4">
                <Card className="bg-white rounded-xl shadow-sm">
                  <CardHeader>
                    <CardTitle>Policy Sections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {policyData.data.sections.map((section, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedSection(section)}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-3 text-left rounded-lg hover:bg-gray-50",
                            selectedSection?.title === section.title && "bg-[#4361EE] text-white hover:bg-[#4361EE]",
                          )}
                        >
                          <span>{section.title}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {selectedSection ? (
                  <>
                    <Card className="bg-white rounded-xl shadow-sm">
                      <CardHeader>
                        <CardTitle>{selectedSection.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="bg-green-50 p-6 rounded-lg">
                            <h4 className="font-semibold flex items-center gap-2 text-green-700 mb-3">
                              <Lightbulb className="w-5 h-5" />
                              Hidden Gem
                            </h4>
                            <p className="text-green-700">{selectedSection.hiddengem}</p>
                          </div>

                          <div className="bg-orange-50 p-6 rounded-lg">
                            <h4 className="font-semibold flex items-center gap-2 text-orange-700 mb-3">
                              <AlertTriangle className="w-5 h-5" />
                              Blind Spot
                            </h4>
                            <p className="text-orange-700">{selectedSection.blindspot}</p>
                          </div>

                          <div className="bg-red-50 p-6 rounded-lg">
                            <h4 className="font-semibold flex items-center gap-2 text-red-700 mb-3">
                              <Flag className="w-5 h-5" />
                              Red Flag
                            </h4>
                            <p className="text-red-700">{selectedSection.redflag}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white rounded-xl shadow-sm">
                      <CardHeader>
                        <CardTitle>Key Insights</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-4">
                          {selectedSection.quotes.map((quote, index) => (
                            <li key={index} className="p-4 bg-gray-50 rounded-lg border-l-4 border-[#4361EE]">
                              {quote}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Select a section to view analysis</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projections" className="space-y-4">
            <Card className="bg-white rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle>Policy Values Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={policyData.data.values}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timePoint" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="values.cashValue"
                        name="Cash Value"
                        stroke="#4361EE"
                        fill="#4361EE"
                        fillOpacity={0.1}
                      />
                      <Area
                        type="monotone"
                        dataKey="values.netSurrenderValue"
                        name="Net Surrender Value"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.1}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chatbot">
            <PolicyChatbot policyData={policyData} userEmail={userEmail} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


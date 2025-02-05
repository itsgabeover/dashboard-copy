"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Lightbulb, Flag, ChevronRight, Info } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { ParsedPolicyData, PolicySection } from "@/types/policy"
import { fetchPolicyData } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"

const getHealthDescription = (score: number): string => {
  if (score >= 90) return "Excellent"
  if (score >= 80) return "Strong"
  if (score >= 70) return "Good"
  return "Fair"
}

export default function Dashboard() {
  const [policyData, setPolicyData] = useState<ParsedPolicyData | null>(null)
  const [selectedSection, setSelectedSection] = useState<PolicySection | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPolicyData() {
      try {
        const data = await fetchPolicyData()
        if (data) {
          setPolicyData(data)
          if (data.data.sections && data.data.sections.length > 0) {
            setSelectedSection(data.data.sections[0])
          }
        } else {
          setError("No policy data available")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred while fetching policy data")
      } finally {
        setIsLoading(false)
      }
    }

    loadPolicyData()
  }, [])

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error || !policyData) {
    return <div className="text-center text-red-600 p-6">{error || "Failed to load policy data"}</div>
  }

  const healthScore = 85 // This should be dynamically calculated based on your logic
  const healthDescription = getHealthDescription(healthScore)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 space-y-8 max-w-7xl">
        <header className="text-center mb-8 bg-white p-6 rounded-xl shadow-sm">
          <h1 className="text-4xl font-bold mb-2 text-[rgb(82,102,255)]">
            {policyData.data.policyOverview.productName}
          </h1>
          <p className="text-xl text-gray-600">{policyData.data.policyOverview.issuer}</p>
        </header>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white border rounded-xl p-1 shadow-sm mb-6">
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
            <TabsTrigger
              value="projections"
              className="data-[state=active]:bg-[rgb(82,102,255)] data-[state=active]:text-white rounded-lg transition-all"
            >
              Projections
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
                      <dd className="text-2xl text-[rgb(82,102,255)]">{policyData.data.policyOverview.productType}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl shadow-sm border-0 ring-1 ring-gray-200">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-xl font-semibold text-gray-900">Policy Health</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center p-6">
                  <div className="text-6xl font-bold mb-2 text-[rgb(82,102,255)]">{healthScore}%</div>
                  <div className="text-2xl font-semibold mb-4 text-gray-700">{getHealthDescription(healthScore)}</div>
                  <div className="w-full h-px bg-gray-200 mb-4" />
                  <Progress value={healthScore} className="w-full h-3 bg-gray-100 rounded-full" />
                  <p className="mt-6 text-sm text-gray-600 text-center bg-blue-50 p-4 rounded-lg border border-blue-100">
                    This health score evaluates your policy's performance across premium structure, guarantees, cash
                    accumulation, available riders, and flexibility options. Higher scores indicate robust features and
                    stronger long-term value.
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
                  {policyData.data.finalThoughts}
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
                  {policyData.data.policyOverview.riders.map((rider, index) => (
                    <li key={index} className="bg-gray-50 p-4 rounded-lg flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-[rgb(82,102,255)] mt-2 mr-3" />
                      <span>{rider}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-xl shadow-sm border-0 ring-1 ring-gray-200">
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-xl font-semibold text-gray-900">Value Projections</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {policyData.data.values.map((timePoint, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-[rgb(82,102,255)] mb-4">{timePoint.timePoint}</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="text-sm text-gray-600 mb-1">Cash Value</p>
                            <p className="text-lg font-semibold">{formatCurrency(timePoint.values.cashValue)}</p>
                          </div>
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="text-sm text-gray-600 mb-1">Net Surrender Value</p>
                            <p className="text-lg font-semibold">
                              {formatCurrency(timePoint.values.netSurrenderValue)}
                            </p>
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-600 mb-1">Death Benefit</p>
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
                <Card className="bg-white rounded-xl shadow-sm border-0 ring-1 ring-gray-200">
                  <CardHeader className="pb-2 border-b">
                    <CardTitle className="text-xl font-semibold text-gray-900">Policy Sections</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {policyData.data.sections.map((section, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedSection(section)}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-3 text-left transition-all rounded-lg hover:bg-gray-50",
                            selectedSection?.title === section.title &&
                              "bg-[rgb(82,102,255)] text-white hover:bg-[rgb(82,102,255)] shadow-md",
                          )}
                        >
                          <span>{section.title}</span>
                          <ChevronRight
                            className={cn(
                              "w-4 h-4 transition-transform",
                              selectedSection?.title === section.title && "rotate-90",
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
                        <CardTitle className="text-xl font-semibold text-gray-900">{selectedSection.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-6">
                          <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                            <h4 className="font-semibold flex items-center gap-2 text-green-700 mb-3">
                              <Lightbulb className="w-5 h-5" />
                              Hidden Gem
                            </h4>
                            <p className="text-green-700 leading-relaxed">{selectedSection.hiddengem}</p>
                          </div>

                          <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
                            <h4 className="font-semibold flex items-center gap-2 text-orange-700 mb-3">
                              <AlertTriangle className="w-5 h-5" />
                              Blind Spot
                            </h4>
                            <p className="text-orange-700 leading-relaxed">{selectedSection.blindspot}</p>
                          </div>

                          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                            <h4 className="font-semibold flex items-center gap-2 text-red-700 mb-3">
                              <Flag className="w-5 h-5" />
                              Red Flag
                            </h4>
                            <p className="text-red-700 leading-relaxed">{selectedSection.redflag}</p>
                          </div>

                          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <h4 className="font-semibold mb-3">Key Takeaways</h4>
                            <p className="text-gray-700 leading-relaxed">{selectedSection.clientImplications}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white rounded-xl shadow-sm border-0 ring-1 ring-gray-200">
                      <CardHeader className="pb-2 border-b">
                        <CardTitle className="text-xl font-semibold text-gray-900">Key Insights</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <ul className="space-y-4">
                          {selectedSection.quotes.map((quote, index) => (
                            <li
                              key={index}
                              className="p-4 bg-gray-50 rounded-lg border-l-4 border-[rgb(82,102,255)] shadow-sm"
                            >
                              {quote}
                            </li>
                          ))}
                        </ul>
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

          <TabsContent value="projections" className="space-y-4">
            <Card className="bg-white rounded-xl shadow-sm border-0 ring-1 ring-gray-200">
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-xl font-semibold text-gray-900">Policy Values Chart</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={policyData.data.values}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="timePoint" tick={{ fill: "#6B7280" }} axisLine={{ stroke: "#E5E7EB" }} />
                      <YAxis tick={{ fill: "#6B7280" }} axisLine={{ stroke: "#E5E7EB" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #E5E7EB",
                          borderRadius: "0.5rem",
                          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="values.cashValue"
                        name="Cash Value"
                        stroke="rgb(82,102,255)"
                        fill="rgba(82,102,255,0.1)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="values.netSurrenderValue"
                        name="Net Surrender Value"
                        stroke="rgb(99,102,241)"
                        fill="rgba(99,102,241,0.1)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


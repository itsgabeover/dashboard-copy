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

  return (
    <div className="container mx-auto p-4 space-y-8 max-w-7xl">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-[rgb(82,102,255)]">{policyData.data.policyOverview.productName}</h1>
        <p className="text-xl text-gray-600">{policyData.data.policyOverview.issuer}</p>
      </header>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white border rounded-lg p-1">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-[rgb(82,102,255)] data-[state=active]:text-white rounded-md transition-colors"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="details"
            className="data-[state=active]:bg-[rgb(82,102,255)] data-[state=active]:text-white rounded-md transition-colors"
          >
            Policy Details
          </TabsTrigger>
          <TabsTrigger
            value="analysis"
            className="data-[state=active]:bg-[rgb(82,102,255)] data-[state=active]:text-white rounded-md transition-colors"
          >
            Analysis
          </TabsTrigger>
          <TabsTrigger
            value="projections"
            className="data-[state=active]:bg-[rgb(82,102,255)] data-[state=active]:text-white rounded-md transition-colors"
          >
            Projections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-gray-900">Policy Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div>
                    <dt className="font-semibold">Death Benefit</dt>
                    <dd>{formatCurrency(policyData.data.policyOverview.deathBenefit)}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Annual Premium</dt>
                    <dd>{formatCurrency(policyData.data.policyOverview.annualPremium)}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Policy Type</dt>
                    <dd>{policyData.data.policyOverview.productType}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-gray-900">Policy Health</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="text-5xl font-bold mb-4 text-[rgb(82,102,255)]">85%</div>
                <Progress value={85} className="w-full h-2 bg-gray-100" />
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-gray-900">Final Thoughts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{policyData.data.finalThoughts}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-gray-900">Policy Riders</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {policyData.data.policyOverview.riders.map((rider, index) => (
                  <li key={index}>{rider}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-gray-900">Value Projections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {policyData.data.values.map((timePoint, index) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <h4 className="font-semibold">{timePoint.timePoint}</h4>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p>Cash Value: {formatCurrency(timePoint.values.cashValue)}</p>
                        <p>Net Surrender Value: {formatCurrency(timePoint.values.netSurrenderValue)}</p>
                      </div>
                      <div>
                        <p>Death Benefit: {formatCurrency(timePoint.values.deathBenefitAmount)}</p>
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
              <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-gray-900">Policy Sections</CardTitle>
                </CardHeader>
                <CardContent className="-mx-2">
                  <div className="space-y-1">
                    {policyData.data.sections.map((section, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSection(section)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-2 text-left transition-colors rounded-md hover:bg-gray-100",
                          selectedSection?.title === section.title &&
                            "bg-[rgb(82,102,255)] text-white hover:bg-[rgb(82,102,255)]",
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
                  <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold text-gray-900">{selectedSection.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                          <h4 className="font-semibold flex items-center gap-2 text-green-700 mb-2">
                            <Lightbulb className="w-5 h-5" />
                            Hidden Gem
                          </h4>
                          <p className="text-green-700">{selectedSection.hiddengem}</p>
                        </div>

                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                          <h4 className="font-semibold flex items-center gap-2 text-orange-700 mb-2">
                            <AlertTriangle className="w-5 h-5" />
                            Blind Spot
                          </h4>
                          <p className="text-orange-700">{selectedSection.blindspot}</p>
                        </div>

                        <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                          <h4 className="font-semibold flex items-center gap-2 text-red-700 mb-2">
                            <Flag className="w-5 h-5" />
                            Red Flag
                          </h4>
                          <p className="text-red-700">{selectedSection.redflag}</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <h4 className="font-semibold mb-2">Client Implications</h4>
                          <p className="text-gray-700">{selectedSection.clientImplications}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold text-gray-900">Key Quotes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {selectedSection.quotes.map((quote, index) => (
                          <li key={index} className="p-3 bg-gray-50 rounded-lg border-l-4 border-[rgb(82,102,255)]">
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
          <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-gray-900">Policy Values Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={policyData.data.values}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timePoint" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="values.cashValue"
                    name="Cash Value"
                    stroke="rgb(82,102,255)"
                    fill="rgba(82,102,255,0.1)"
                  />
                  <Area
                    type="monotone"
                    dataKey="values.netSurrenderValue"
                    name="Net Surrender Value"
                    stroke="rgb(99,102,241)"
                    fill="rgba(99,102,241,0.1)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


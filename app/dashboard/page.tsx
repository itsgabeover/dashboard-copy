"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Lightbulb, Flag } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { ParsedPolicyData, PolicySection } from "@/types/policy"
import { fetchPolicyData } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"

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
    <div className="container mx-auto p-4 space-y-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{policyData.data.policyOverview.productName}</h1>
        <p className="text-xl text-gray-600">{policyData.data.policyOverview.issuer}</p>
      </header>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Policy Details</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Policy Summary</CardTitle>
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
            <Card>
              <CardHeader>
                <CardTitle>Policy Health</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="text-5xl font-bold mb-4">85%</div>
                <Progress value={85} className="w-full" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Final Thoughts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{policyData.data.finalThoughts}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Policy Riders</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {policyData.data.policyOverview.riders.map((rider, index) => (
                  <li key={index}>{rider}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Value Projections</CardTitle>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{selectedSection?.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      Hidden Gem
                    </h4>
                    <p>{selectedSection?.hiddengem}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      Blind Spot
                    </h4>
                    <p>{selectedSection?.blindspot}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      <Flag className="w-5 h-5 text-red-500" />
                      Red Flag
                    </h4>
                    <p>{selectedSection?.redflag}</p>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold">Client Implications</h4>
                    <p>{selectedSection?.clientImplications}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Policy Sections</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {policyData.data.sections.map((section, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
                      onClick={() => setSelectedSection(section)}
                    >
                      <span>{section.title}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Policy Values Chart</CardTitle>
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
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="values.netSurrenderValue" 
                    name="Net Surrender Value"
                    stroke="#8884d8" 
                    fill="#8884d8" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Quotes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {selectedSection?.quotes.map((quote, index) => (
                  <li key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    {quote}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

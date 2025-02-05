"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { AlertTriangle, Lightbulb, Flag } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { ParsedPolicyData, Category } from "@/types/policy"
import { fetchPolicyData } from "@/lib/api"

export default function Dashboard() {
  const [policyData, setPolicyData] = useState<ParsedPolicyData | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedYear, setSelectedYear] = useState(30)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPolicyData() {
      try {
        const data = await fetchPolicyData()
        if (data) {
          setPolicyData(data)
          if (data.data.categories && data.data.categories.length > 0) {
            setSelectedCategory(data.data.categories[0])
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

  const { policyOverview, riders, categories, timePoints } = policyData.data

  return (
    <div className="container mx-auto p-4 space-y-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{policyOverview.productName}</h1>
        <p className="text-xl text-gray-600">{policyOverview.carrierName}</p>
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
                    <dd>${policyOverview.deathBenefit.toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Annual Premium</dt>
                    <dd>${policyOverview.premiumAmount.toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Policy Type</dt>
                    <dd>{policyOverview.policyDesign}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Policy Health Score</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="text-5xl font-bold mb-4">
                  {Math.round(categories.reduce((acc, cat) => acc + cat.score, 0) / categories.length)}%
                </div>
                <Progress
                  value={Math.round(categories.reduce((acc, cat) => acc + cat.score, 0) / categories.length)}
                  className="w-full"
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Categories Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={categories}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="score" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
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
                {riders.map((rider, index) => (
                  <li key={index}>{rider}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Policy Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="font-semibold">Product Name</dt>
                  <dd>{policyOverview.productName}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Carrier Name</dt>
                  <dd>{policyOverview.carrierName}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Policy Design</dt>
                  <dd>{policyOverview.policyDesign}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Death Benefit</dt>
                  <dd>${policyOverview.deathBenefit.toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Annual Premium</dt>
                  <dd>${policyOverview.premiumAmount.toLocaleString()}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{selectedCategory?.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      Hidden Gem
                    </h4>
                    <p>{selectedCategory?.hiddenGem}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      Blind Spot
                    </h4>
                    <p>{selectedCategory?.blindSpot}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      <Flag className="w-5 h-5 text-red-500" />
                      Red Flag
                    </h4>
                    <p>{selectedCategory?.redFlag}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Category Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {categories.map((category, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
                      onClick={() => setSelectedCategory(category)}
                    >
                      <span>{category.name}</span>
                      <span className="font-semibold">{category.score}%</span>
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
              <CardTitle>Policy Projections</CardTitle>
              <CardDescription>Adjust the slider to see projections for different years</CardDescription>
            </CardHeader>
            <CardContent>
              <Slider
                defaultValue={[30]}
                max={Math.max(...timePoints.map((tp) => tp.year))}
                step={10}
                onValueChange={(value) => setSelectedYear(value[0])}
                className="mb-6"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Year {selectedYear}</h4>
                  <p>Cash Value: ${timePoints.find((tp) => tp.year === selectedYear)?.cashValue.toLocaleString()}</p>
                  <p>
                    Net Surrender Value: $
                    {timePoints.find((tp) => tp.year === selectedYear)?.netSurrenderValue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Death Benefit</h4>
                  <p>${policyOverview.deathBenefit.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cash Value Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timePoints}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="cashValue" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group"
import { Label } from "../../../components/ui/label"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { FileText, ArrowRight, HelpCircle } from "lucide-react"

interface IllustrationType {
  id: string
  title: string
  description: string
  icon: JSX.Element
  tooltip?: string
}

const illustrationTypes: IllustrationType[] = [
  {
    id: "current",
    title: "Current In-Force Illustration",
    description: "Shows how your policy performs if you continue your current premium payments.",
    icon: <FileText className="h-6 w-6" />,
    tooltip: "Most common request - gives you a clear picture of your policy's current path",
  },
  {
    id: "minimum",
    title: "Minimum Premium In-Force Illustration",
    description: "Calculates the smallest premium needed to maintain your coverage.",
    icon: <FileText className="h-6 w-6" />,
    tooltip: "Helpful if you're looking to reduce your payments",
  },
  {
    id: "zero",
    title: "Zero Premium In-Force Illustration",
    description: "Shows what happens if you stop paying premiums now.",
    icon: <FileText className="h-6 w-6" />,
    tooltip: "Understand your options if considering stopping payments",
  },
  {
    id: "reduced",
    title: "Reduced Coverage In-Force Illustration",
    description: "Shows coverage you can keep without paying more premiums.",
    icon: <FileText className="h-6 w-6" />,
    tooltip: "Best for planning to stop premiums but keep some coverage",
  },
  {
    id: "maximum",
    title: "Maximum Coverage In-Force Illustration",
    description: "Shows highest coverage possible with current premium.",
    icon: <FileText className="h-6 w-6" />,
    tooltip: "See if your premiums could provide more coverage",
  },
]

interface TypeSelectionProps {
  formData: {
    illustrationType: string
    minimumPremiumAge: string
  }
  updateFormData: (data: Partial<{ illustrationType: string; minimumPremiumAge: string }>) => void
  nextStep: () => void
}

export default function TypeSelection({ formData, updateFormData, nextStep }: TypeSelectionProps) {
  const [selectedType, setSelectedType] = useState(formData.illustrationType)
  const [minimumPremiumAge, setMinimumPremiumAge] = useState(formData.minimumPremiumAge)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateFormData({ illustrationType: selectedType, minimumPremiumAge })
    nextStep()
  }

  return (
    <div>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="space-y-6">
          <CardTitle className="text-3xl font-bold text-center text-[#4B6FEE]">Type Selection</CardTitle>
          <CardDescription className="text-lg text-center max-w-2xl mx-auto">
            An in-force illustration (IFL) shows you exactly how your life insurance policy is performing and what to
            expect in the future. Think of it as a detailed forecast of your policy.
          </CardDescription>
          <CardDescription className="text-base text-center font-medium text-[#4B6FEE]">
            Choose the type of illustration that best fits your needs:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <RadioGroup value={selectedType} onValueChange={setSelectedType} className="grid gap-4">
              {illustrationTypes.map((type) => (
                <div key={type.id}>
                  <div
                    className={`
                    flex items-start space-x-4 p-6 rounded-lg border-2 cursor-pointer
                    ${selectedType === type.id ? "border-[#4B6FEE] bg-blue-50/50" : "border-gray-200"}
                    hover:border-[#4B6FEE] hover:bg-blue-50/30 transition-all duration-200
                  `}
                  >
                    <RadioGroupItem value={type.id} id={type.id} className="mt-1" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={type.id} className="text-lg font-semibold cursor-pointer">
                          {type.title}
                        </Label>
                        {type.tooltip && <HelpCircle className="h-4 w-4 text-gray-400" />}
                      </div>
                      <p className="text-gray-600">{type.description}</p>
                      {type.id === "minimum" && selectedType === "minimum" && (
                        <div className="pt-4">
                          <Label htmlFor="minimumPremiumAge" className="text-sm font-medium block mb-2">
                            Until what age? (most people choose 95)
                          </Label>
                          <Input
                            type="number"
                            id="minimumPremiumAge"
                            value={minimumPremiumAge}
                            onChange={(e) => setMinimumPremiumAge(e.target.value)}
                            min={65}
                            max={121}
                            className="w-32"
                            placeholder="95"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={!selectedType || (selectedType === "minimum" && !minimumPremiumAge)}
                className="bg-[#4B6FEE] hover:bg-blue-600 text-white px-8 py-6 rounded-full text-lg font-semibold transition-all duration-300 hover:transform hover:scale-105"
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


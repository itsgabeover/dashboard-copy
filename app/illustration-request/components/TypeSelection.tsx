"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "../../../components/ui/card"
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group"
import { Label } from "../../../components/ui/label"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { HelpCircle, ArrowRight } from "lucide-react"

interface IllustrationType {
  id: string
  title: string
  description: string
  tooltip?: string
}

const illustrationTypes: IllustrationType[] = [
  {
    id: "current",
    title: "Current In-Force Illustration",
    description: "Shows how your policy performs if you continue your current premium payments.",
    tooltip: "Most common request - gives you a clear picture of your policy's current path",
  },
  {
    id: "minimum",
    title: "Minimum Premium In-Force Illustration",
    description: "Calculates the smallest premium needed to maintain your coverage.",
    tooltip: "Helpful if you're looking to reduce your payments",
  },
  {
    id: "zero",
    title: "Zero Premium In-Force Illustration",
    description: "Shows what happens if you stop paying premiums now.",
    tooltip: "Understand your options if considering stopping payments",
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
    <div className="p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-center text-[#4B6FEE]">Type Selection</h2>

        <p className="text-gray-600 text-center">
          An in-force illustration (IFL) shows you exactly how your life insurance policy is performing and what to
          expect in the future. Think of it as a detailed forecast of your policy.
        </p>

        <p className="text-[#4B6FEE] text-center font-medium">
          Choose the type of illustration that best fits your needs:
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <RadioGroup value={selectedType} onValueChange={setSelectedType} className="space-y-4">
            {illustrationTypes.map((type) => (
              <div
                key={type.id}
                className={`relative rounded-lg border p-4 transition-colors
                  ${selectedType === type.id ? "border-[#4B6FEE] bg-blue-50/30" : "border-gray-200"}
                `}
              >
                <div className="flex items-start gap-4">
                  <RadioGroupItem value={type.id} id={type.id} className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={type.id} className="text-lg font-semibold">
                        {type.title}
                      </Label>
                      {type.tooltip && <HelpCircle className="h-4 w-4 text-gray-400" />}
                    </div>
                    <p className="text-gray-600 mt-1">{type.description}</p>
                    {type.id === "minimum" && selectedType === "minimum" && (
                      <div className="mt-4">
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

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!selectedType || (selectedType === "minimum" && !minimumPremiumAge)}
              className="bg-[#4B6FEE] text-white px-8 py-2 rounded-full font-medium hover:bg-blue-600 transition-colors"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}


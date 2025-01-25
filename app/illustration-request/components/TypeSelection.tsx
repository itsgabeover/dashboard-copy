"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface IllustrationType {
  id: string
  title: string
  description: string
}

const illustrationTypes: IllustrationType[] = [
  {
    id: "current",
    title: "Current In-Force Illustration",
    description:
      "Shows how your policy performs if you continue your current premium payments. This is the most common request and gives you a clear picture of your policy's current path.",
  },
  {
    id: "minimum",
    title: "Minimum Premium In-Force Illustration",
    description:
      "Calculates the smallest premium needed to maintain your coverage. If you're looking to reduce your payments, this shows your options.",
  },
  {
    id: "zero",
    title: "Zero Premium In-Force Illustration",
    description:
      "Shows what happens if you stop paying premiums now. This helps you understand your options if you're considering stopping payments.",
  },
  {
    id: "reduced",
    title: "Reduced Coverage In-Force Illustration",
    description:
      "Calculates how much coverage you can keep without paying any more premiums. Useful if you're planning to stop premium payments but want to keep some coverage.",
  },
  {
    id: "maximum",
    title: "Maximum Coverage In-Force Illustration",
    description:
      "Shows the highest coverage amount possible while keeping your current premium the same. Good for understanding if your premiums could provide more coverage.",
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Type Selection</CardTitle>
        <CardDescription>
          An in-force illustration (IFL) shows you exactly how your life insurance policy is performing and what to
          expect in the future. Think of it as a detailed forecast of your policy. Insurance companies provide these at
          no cost to help you understand your coverage better.
        </CardDescription>
        <CardDescription className="mt-4">
          First, let's choose the type of illustration that best fits your needs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <RadioGroup value={selectedType} onValueChange={setSelectedType} className="space-y-4">
            {illustrationTypes.map((type) => (
              <div key={type.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value={type.id} id={type.id} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={type.id} className="text-lg font-medium">
                    {type.title}
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                  {type.id === "minimum" && (
                    <div className="mt-2">
                      <Label htmlFor="minimumPremiumAge" className="text-sm font-medium">
                        Until what age? (most people choose 95)
                      </Label>
                      <Input
                        type="number"
                        id="minimumPremiumAge"
                        value={minimumPremiumAge}
                        onChange={(e) => setMinimumPremiumAge(e.target.value)}
                        min={65}
                        max={121}
                        className="mt-1 w-24"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </RadioGroup>
          <div className="mt-6">
            <Button type="submit" disabled={!selectedType || (selectedType === "minimum" && !minimumPremiumAge)}>
              Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}



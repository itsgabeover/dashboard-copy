"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const states = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
]

interface FormData {
  ownerInfo: {
    firstName: string
    lastName: string
    streetAddress: string
    city: string
    state: string
    zipCode: string
    phoneNumber: string
    emailAddress: string
  }
  policyInfo: {
    policyNumber: string
    insuranceCompanyName: string
  }
}

interface InformationCollectionProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  nextStep: () => void
  prevStep: () => void
}

export default function InformationCollection({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}: InformationCollectionProps) {
  const [localFormData, setLocalFormData] = useState<FormData>(formData)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, section: "ownerInfo" | "policyInfo") => {
    const { name, value } = e.target
    setLocalFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateFormData(localFormData)
    nextStep()
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Add Your Information</CardTitle>
        <CardDescription>
          Now let's create your request letter. Fill in your details below and we'll generate a professional letter for
          your insurance company.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Owner Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name*</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={localFormData.ownerInfo.firstName}
                  onChange={(e) => handleInputChange(e, "ownerInfo")}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name*</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={localFormData.ownerInfo.lastName}
                  onChange={(e) => handleInputChange(e, "ownerInfo")}
                  required
                />
              </div>
              <div>
                <Label htmlFor="streetAddress">Street Address*</Label>
                <Input
                  id="streetAddress"
                  name="streetAddress"
                  value={localFormData.ownerInfo.streetAddress}
                  onChange={(e) => handleInputChange(e, "ownerInfo")}
                  required
                />
              </div>
              <div>
                <Label htmlFor="city">City*</Label>
                <Input
                  id="city"
                  name="city"
                  value={localFormData.ownerInfo.city}
                  onChange={(e) => handleInputChange(e, "ownerInfo")}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State*</Label>
                <Select
                  name="state"
                  value={localFormData.ownerInfo.state}
                  onValueChange={(value) =>
                    setLocalFormData((prev) => ({
                      ...prev,
                      ownerInfo: { ...prev.ownerInfo, state: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code*</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={localFormData.ownerInfo.zipCode}
                  onChange={(e) => handleInputChange(e, "ownerInfo")}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={localFormData.ownerInfo.phoneNumber}
                  onChange={(e) => handleInputChange(e, "ownerInfo")}
                />
              </div>
              <div>
                <Label htmlFor="emailAddress">Email Address</Label>
                <Input
                  id="emailAddress"
                  name="emailAddress"
                  type="email"
                  value={localFormData.ownerInfo.emailAddress}
                  onChange={(e) => handleInputChange(e, "ownerInfo")}
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Policy Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="policyNumber">Policy Number*</Label>
                <Input
                  id="policyNumber"
                  name="policyNumber"
                  value={localFormData.policyInfo.policyNumber}
                  onChange={(e) => handleInputChange(e, "policyInfo")}
                  required
                />
              </div>
              <div>
                <Label htmlFor="insuranceCompanyName">Insurance Company Name*</Label>
                <Input
                  id="insuranceCompanyName"
                  name="insuranceCompanyName"
                  value={localFormData.policyInfo.insuranceCompanyName}
                  onChange={(e) => handleInputChange(e, "policyInfo")}
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}



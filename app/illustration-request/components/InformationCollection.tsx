"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { ArrowLeft, ArrowRight, User, Building2, Phone, Mail, MapPin } from "lucide-react"
import HomeButton from "./HomeButton"

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
    insuranceCompanyAddress: string
    insuranceCompanyCity: string
    insuranceCompanyState: string
    insuranceCompanyZip: string
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
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (section: keyof FormData, field: string, value: string) => {
    setLocalFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    const requiredFields = {
      firstName: "First name is required",
      lastName: "Last name is required",
      streetAddress: "Street address is required",
      city: "City is required",
      state: "State is required",
      zipCode: "ZIP code is required",
      policyNumber: "Policy number is required",
      insuranceCompanyName: "Insurance company name is required",
    }

    Object.entries(requiredFields).forEach(([field, message]) => {
      const section = field in formData.ownerInfo ? "ownerInfo" : "policyInfo"
      if (!localFormData[section][field as keyof (typeof localFormData)[typeof section]]) {
        newErrors[field] = message
      }
    })

    if (localFormData.ownerInfo.zipCode && !/^\d{5}(-\d{4})?$/.test(localFormData.ownerInfo.zipCode)) {
      newErrors.zipCode = "Invalid ZIP code format"
    }

    if (
      localFormData.ownerInfo.emailAddress &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(localFormData.ownerInfo.emailAddress)
    ) {
      newErrors.emailAddress = "Invalid email address"
    }

    if (
      localFormData.ownerInfo.phoneNumber &&
      !/^\+?1?\d{10}$/.test(localFormData.ownerInfo.phoneNumber.replace(/[^\d]/g, ""))
    ) {
      newErrors.phoneNumber = "Invalid phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      updateFormData(localFormData)
      nextStep()
    }
  }

  return (
    <div className="relative p-8">
      <HomeButton />
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-[#4B6FEE] mb-4">Add Your Information</h2>

        <p className="text-gray-600 text-center mb-8">
          Let&apos;s create your request letter. Fill in your details below and we&apos;ll generate a professional
          letter for your insurance company.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Owner Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-[#4B6FEE]" />
              <h3 className="text-lg font-semibold">Owner Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={localFormData.ownerInfo.firstName}
                  onChange={(e) => handleInputChange("ownerInfo", "firstName", e.target.value)}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={localFormData.ownerInfo.lastName}
                  onChange={(e) => handleInputChange("ownerInfo", "lastName", e.target.value)}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="streetAddress" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  Street Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="streetAddress"
                  value={localFormData.ownerInfo.streetAddress}
                  onChange={(e) => handleInputChange("ownerInfo", "streetAddress", e.target.value)}
                  className={errors.streetAddress ? "border-red-500" : ""}
                />
                {errors.streetAddress && <p className="text-red-500 text-sm">{errors.streetAddress}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  value={localFormData.ownerInfo.city}
                  onChange={(e) => handleInputChange("ownerInfo", "city", e.target.value)}
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  State <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={localFormData.ownerInfo.state}
                  onValueChange={(value) => handleInputChange("ownerInfo", "state", value)}
                >
                  <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {states.map((state) => (
                      <SelectItem key={state} value={state} className="hover:bg-gray-100">
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  ZIP Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="zipCode"
                  value={localFormData.ownerInfo.zipCode}
                  onChange={(e) => handleInputChange("ownerInfo", "zipCode", e.target.value)}
                  className={errors.zipCode ? "border-red-500" : ""}
                />
                {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={localFormData.ownerInfo.phoneNumber}
                  onChange={(e) => handleInputChange("ownerInfo", "phoneNumber", e.target.value)}
                  className={errors.phoneNumber ? "border-red-500" : ""}
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailAddress" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  Email Address
                </Label>
                <Input
                  id="emailAddress"
                  type="email"
                  value={localFormData.ownerInfo.emailAddress}
                  onChange={(e) => handleInputChange("ownerInfo", "emailAddress", e.target.value)}
                  className={errors.emailAddress ? "border-red-500" : ""}
                />
                {errors.emailAddress && <p className="text-red-500 text-sm">{errors.emailAddress}</p>}
              </div>
            </div>
          </div>

          {/* Policy Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-[#4B6FEE]" />
              <h3 className="text-lg font-semibold">Policy Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="policyNumber" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  Policy Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="policyNumber"
                  value={localFormData.policyInfo.policyNumber}
                  onChange={(e) => handleInputChange("policyInfo", "policyNumber", e.target.value)}
                  className={errors.policyNumber ? "border-red-500" : ""}
                />
                {errors.policyNumber && <p className="text-red-500 text-sm">{errors.policyNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="insuranceCompanyName" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  Insurance Company Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="insuranceCompanyName"
                  value={localFormData.policyInfo.insuranceCompanyName}
                  onChange={(e) => handleInputChange("policyInfo", "insuranceCompanyName", e.target.value)}
                  className={errors.insuranceCompanyName ? "border-red-500" : ""}
                />
                {errors.insuranceCompanyName && <p className="text-red-500 text-sm">{errors.insuranceCompanyName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="insuranceCompanyAddress" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  Insurance Company Address
                </Label>
                <Input
                  id="insuranceCompanyAddress"
                  value={localFormData.policyInfo.insuranceCompanyAddress}
                  onChange={(e) => handleInputChange("policyInfo", "insuranceCompanyAddress", e.target.value)}
                  placeholder="[Insurance Company Address]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="insuranceCompanyCity" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  City
                </Label>
                <Input
                  id="insuranceCompanyCity"
                  value={localFormData.policyInfo.insuranceCompanyCity}
                  onChange={(e) => handleInputChange("policyInfo", "insuranceCompanyCity", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="insuranceCompanyState" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  State
                </Label>
                <Select
                  value={localFormData.policyInfo.insuranceCompanyState}
                  onValueChange={(value) => handleInputChange("policyInfo", "insuranceCompanyState", value)}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {states.map((state) => (
                      <SelectItem key={state} value={state} className="hover:bg-gray-100">
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="insuranceCompanyZip" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  ZIP Code
                </Label>
                <Input
                  id="insuranceCompanyZip"
                  value={localFormData.policyInfo.insuranceCompanyZip}
                  onChange={(e) => handleInputChange("policyInfo", "insuranceCompanyZip", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={prevStep} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              type="submit"
              className="bg-[#4B6FEE] text-white px-8 py-2 rounded-full font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}


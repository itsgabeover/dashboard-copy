"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, User, Building2, Phone, Mail, MapPin } from "lucide-react"

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
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, section: "ownerInfo" | "policyInfo") => {
    const { name, value } = e.target
    setLocalFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields validation
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
      if (!localFormData.ownerInfo[field as keyof typeof localFormData.ownerInfo] && field in localFormData.ownerInfo) {
        newErrors[field] = message
      }
      if (
        !localFormData.policyInfo[field as keyof typeof localFormData.policyInfo] &&
        field in localFormData.policyInfo
      ) {
        newErrors[field] = message
      }
    })

    // ZIP code format validation
    if (localFormData.ownerInfo.zipCode && !/^\d{5}(-\d{4})?$/.test(localFormData.ownerInfo.zipCode)) {
      newErrors.zipCode = "Invalid ZIP code format"
    }

    // Email format validation
    if (
      localFormData.ownerInfo.emailAddress &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(localFormData.ownerInfo.emailAddress)
    ) {
      newErrors.emailAddress = "Invalid email address"
    }

    // Phone format validation
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
      updateFormData({
        ownerInfo: localFormData.ownerInfo,
        policyInfo: localFormData.policyInfo,
      })
      nextStep()
    }
  }

  const formSections = [
    {
      title: "Owner Information",
      icon: <User className="h-5 w-5" />,
      fields: [
        {
          name: "firstName",
          label: "First Name",
          required: true,
          type: "text",
          section: "ownerInfo" as const,
          icon: <User className="h-4 w-4 text-gray-500" />,
        },
        {
          name: "lastName",
          label: "Last Name",
          required: true,
          type: "text",
          section: "ownerInfo" as const,
          icon: <User className="h-4 w-4 text-gray-500" />,
        },
        {
          name: "streetAddress",
          label: "Street Address",
          required: true,
          type: "text",
          section: "ownerInfo" as const,
          icon: <MapPin className="h-4 w-4 text-gray-500" />,
        },
        {
          name: "city",
          label: "City",
          required: true,
          type: "text",
          section: "ownerInfo" as const,
          icon: <MapPin className="h-4 w-4 text-gray-500" />,
        },
        {
          name: "zipCode",
          label: "ZIP Code",
          required: true,
          type: "text",
          section: "ownerInfo" as const,
          icon: <MapPin className="h-4 w-4 text-gray-500" />,
        },
        {
          name: "phoneNumber",
          label: "Phone Number",
          required: false,
          type: "tel",
          section: "ownerInfo" as const,
          icon: <Phone className="h-4 w-4 text-gray-500" />,
        },
        {
          name: "emailAddress",
          label: "Email Address",
          required: false,
          type: "email",
          section: "ownerInfo" as const,
          icon: <Mail className="h-4 w-4 text-gray-500" />,
        },
      ],
    },
    {
      title: "Policy Information",
      icon: <Building2 className="h-5 w-5" />,
      fields: [
        {
          name: "policyNumber",
          label: "Policy Number",
          required: true,
          type: "text",
          section: "policyInfo" as const,
          icon: <Building2 className="h-4 w-4 text-gray-500" />,
        },
        {
          name: "insuranceCompanyName",
          label: "Insurance Company Name",
          required: true,
          type: "text",
          section: "policyInfo" as const,
          icon: <Building2 className="h-4 w-4 text-gray-500" />,
        },
      ],
    },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="space-y-6">
          <CardTitle className="text-3xl font-bold text-center text-[#4B6FEE]">Add Your Information</CardTitle>
          <CardDescription className="text-lg text-center max-w-2xl mx-auto">
            Let&apos;s create your request letter. Fill in your details below and we&apos;ll generate a professional
            letter for your insurance company.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {formSections.map((section) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-6">
                    {section.icon}
                    <h3 className="text-xl font-semibold">{section.title}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {section.fields.map((field) => (
                      <div key={field.name} className="space-y-2">
                        <Label htmlFor={field.name} className="flex items-center gap-2">
                          {field.icon}
                          {field.label}
                          {field.required && <span className="text-red-500">*</span>}
                        </Label>
                        {field.name === "state" ? (
                          <Select
                            value={localFormData.ownerInfo.state}
                            onValueChange={(value) =>
                              setLocalFormData((prev) => ({
                                ...prev,
                                ownerInfo: { ...prev.ownerInfo, state: value },
                              }))
                            }
                          >
                            <SelectTrigger className="w-full">
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
                        ) : (
                          <div className="relative">
                            <Input
                              id={field.name}
                              name={field.name}
                              type={field.type}
                              value={
                                localFormData[field.section][
                                  field.name as keyof (typeof localFormData)[typeof field.section]
                                ]
                              }
                              onChange={(e) => handleInputChange(e, field.section)}
                              className={errors[field.name] ? "border-red-500" : ""}
                              required={field.required}
                            />
                            {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
            <div className="flex justify-between pt-6">
              <Button type="button" variant="outline" onClick={prevStep} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                type="submit"
                className="bg-[#4B6FEE] hover:bg-blue-600 text-white px-8 py-6 rounded-full text-lg font-semibold transition-all duration-300 hover:transform hover:scale-105"
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}


"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Card } from "../../components/ui/card"

const TypeSelection = dynamic(() => import("./components/TypeSelection"))
const InformationCollection = dynamic(() => import("./components/InformationCollection"))
const ReviewAndDownload = dynamic(() => import("./components/ReviewAndDownload"))

interface FormData {
  illustrationType: string
  minimumPremiumAge: string
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

const initialFormData: FormData = {
  illustrationType: "",
  minimumPremiumAge: "",
  ownerInfo: {
    firstName: "",
    lastName: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    emailAddress: "",
  },
  policyInfo: {
    policyNumber: "",
    insuranceCompanyName: "",
  },
}

export default function IllustrationRequest() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...newData,
    }))
  }

  const nextStep = () => {
    setStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-[#4B6FEE] text-center">Request an In-Force Illustration</h1>

        <div className="flex justify-center items-center gap-4 mb-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${step === num ? "bg-[#4B6FEE] text-white" : "bg-gray-200 text-gray-600"}`}
              >
                {num}
              </div>
              {num < 3 && <div className="w-16 h-0.5 mx-2 bg-gray-200" />}
            </div>
          ))}
        </div>

        <Card className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
          {step === 1 && <TypeSelection formData={formData} updateFormData={updateFormData} nextStep={nextStep} />}
          {step === 2 && (
            <InformationCollection
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === 3 && <ReviewAndDownload formData={formData} prevStep={prevStep} />}
        </Card>
      </div>
    </div>
  )
}


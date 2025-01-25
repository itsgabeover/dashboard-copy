"use client"

import { useState } from "react"
import TypeSelection from "./components/TypeSelection"
import InformationCollection from "./components/InformationCollection"
import ReviewAndDownload from "./components/ReviewAndDownload"

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
    insuranceCompanyAddress: string
    insuranceCompanyCity: string
    insuranceCompanyState: string
    insuranceCompanyZip: string
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
    insuranceCompanyAddress: "",
    insuranceCompanyCity: "",
    insuranceCompanyState: "",
    insuranceCompanyZip: "",
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
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-[#4B6FEE] text-center mb-8">
          Create Your In-Force Illustration Request Document
        </h1>

        <div className="flex justify-center items-center gap-4 mb-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${step === num ? "bg-[#4B6FEE] text-white" : "bg-gray-200 text-gray-600"}`}
              >
                {num}
              </div>
              {num < 3 && <div className={`w-16 h-0.5 ${num < step ? "bg-[#4B6FEE]" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
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
        </div>
      </div>
    </div>
  )
}


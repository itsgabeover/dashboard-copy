"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import ProgressIndicator from "./components/ProgressIndicator"

const TypeSelection = dynamic(() => import("./components/TypeSelection"), { ssr: false })
const InformationCollection = dynamic(() => import("./components/InformationCollection"), { ssr: false })
const ReviewAndDownload = dynamic(() => import("./components/ReviewAndDownload"), { ssr: false })

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

export default function IllustrationRequest() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
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
  })

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...newData,
    }))
  }

  const nextStep = () => {
    setStep((prev) => prev + 1)
  }
  const prevStep = () => setStep((prevStep) => prevStep - 1)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-100/50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-[#4B6FEE] mb-8 text-center">Request an In-Force Illustration</h1>
        <ProgressIndicator currentStep={step} totalSteps={3} />
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
  )
}


"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, Clock, ArrowRight } from "lucide-react"

export default function ProcessingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const steps = [
    { id: 1, text: "Uploaded successfully", icon: CheckCircle },
    { id: 2, text: "Insurance Planner AI is analyzing your illustration", icon: Clock },
    {
      id: 3,
      text: "Key AI Analysis Areas:",
      icon: ArrowRight,
      subSteps: [
        "Protection Structure",
        "Premium & Funding Analysis",
        "Growth & Value Features",
        "Policy Benefits & Riders",
      ],
    },
  ]

  useEffect(() => {
    const totalDuration = 75000 // 75 seconds (midpoint of 60-90 seconds)
    const interval = 1000 // Update every second
    const incrementPerInterval = 100 / (totalDuration / interval)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + incrementPerInterval
      })
    }, interval)

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev))
    }, totalDuration / steps.length)

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
    }
  }, [steps.length])

  useEffect(() => {
    if (progress === 100) {
      // Redirect to portal page when processing is complete
      router.push("/portal")
    }
  }, [progress, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-100 p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Analyzing Your Policy</h1>

        <div className="mb-8">
          <div className="h-2 w-full bg-blue-200 rounded-full">
            <motion.div
              className="h-full bg-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            Estimated time: {Math.max(0, Math.ceil(75 - (progress / 100) * 75))} seconds remaining
          </p>
        </div>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: index <= currentStep ? 1 : 0.5, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`flex items-start space-x-4 ${index <= currentStep ? "text-blue-600" : "text-gray-400"}`}
            >
              <step.icon className="w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">{step.text}</p>
                {step.subSteps && (
                  <ul className="mt-2 space-y-2">
                    {step.subSteps.map((subStep, subIndex) => (
                      <motion.li
                        key={subIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: index <= currentStep ? 1 : 0.5, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * subIndex }}
                        className="flex items-center space-x-2"
                      >
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        <span>{subStep}</span>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg font-semibold text-gray-700">
            Our AI is working hard to save you hours of analysis time.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            We&apos;re thoroughly examining your policy to provide you with valuable insights and recommendations.
          </p>
        </div>

        <motion.div
          className="mt-8 p-4 bg-blue-50 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <p className="text-sm text-blue-700 italic">
            &ldquo;The analysis you&apos;re about to receive would typically take an experienced insurance professional
            several hours to compile. Our AI completes this in minutes, providing you with rapid, comprehensive insights
            into your policy.&rdquo;
          </p>
        </motion.div>
      </div>
    </div>
  )
}


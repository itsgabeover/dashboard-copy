"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, Clock, ArrowRight, Mail, FileText, Star, Eye, Flag } from "lucide-react"
// Update import paths to use absolute imports with @/ prefix
import type { Step, InsightNode, MindMapNode } from "@/types/processing"
import { fadeInUp, pulseAnimation, drawLine } from "@/utils/animations"

const steps: Step[] = [
  { id: 1, text: "Initial Analysis Launch", icon: CheckCircle },
  { id: 2, text: "Expanding Analysis Framework", icon: Clock },
  { id: 3, text: "Deep Analysis Phase", icon: ArrowRight },
  { id: 4, text: "Insight Generation", icon: Star },
  { id: 5, text: "Final Compilation", icon: FileText },
]

const insights: InsightNode[] = [
  {
    id: "gem1",
    type: "gem",
    text: "Hidden Cash Value Growth",
    description: "Your policy has a unique cash value acceleration feature.",
  },
  {
    id: "spot1",
    type: "spot",
    text: "Premium Flexibility",
    description: "You may have options to adjust your premium payments.",
  },
  {
    id: "flag1",
    type: "flag",
    text: "Beneficiary Review Needed",
    description: "It's time to review and possibly update your beneficiaries.",
  },
  // Add more insights as needed
]

const mindMapNodes: MindMapNode[] = insights.map((insight, index) => ({
  ...insight,
  x: Math.cos((index * Math.PI) / 2) * 150 + 250,
  y: Math.sin((index * Math.PI) / 2) * 150 + 250,
  connections: [],
}))

export default function ProcessingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showMindMap, setShowMindMap] = useState(false)

  useEffect(() => {
    const totalDuration = 75000 // 75 seconds
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
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1
        } else {
          clearInterval(stepInterval)
          setShowMindMap(true)
          return prev
        }
      })
    }, totalDuration / steps.length)

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
    }
  }, [])

  useEffect(() => {
    if (progress === 100) {
      // Redirect to dashboard page when processing is complete
      setTimeout(() => router.push("/dashboard"), 2000)
    }
  }, [progress, router])

  const getIconComponent = (step: Step) => {
    switch (step.icon) {
      case CheckCircle:
        return <CheckCircle className="w-6 h-6 mt-1 flex-shrink-0" />
      case Clock:
        return <Clock className="w-6 h-6 mt-1 flex-shrink-0" />
      case ArrowRight:
        return <ArrowRight className="w-6 h-6 mt-1 flex-shrink-0" />
      case Star:
        return <Star className="w-6 h-6 mt-1 flex-shrink-0" />
      case FileText:
        return <FileText className="w-6 h-6 mt-1 flex-shrink-0" />
      default:
        return null
    }
  }

  const getInsightIcon = (type: InsightNode["type"]) => {
    switch (type) {
      case "gem":
        return <Star className="w-4 h-4 text-green-500" />
      case "spot":
        return <Eye className="w-4 h-4 text-yellow-500" />
      case "flag":
        return <Flag className="w-4 h-4 text-red-500" />
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-100 p-4">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <AnimatePresence>
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  variants={fadeInUp}
                  initial="initial"
                  animate={index <= currentStep ? "animate" : "initial"}
                  exit="exit"
                  className={`flex items-start space-x-4 ${index <= currentStep ? "text-blue-600" : "text-gray-400"}`}
                >
                  {getIconComponent(step)}
                  <div>
                    <p className="font-semibold">{step.text}</p>
                    {step.id === 2 && index <= currentStep && (
                      <ul className="mt-2 space-y-2">
                        {["Hidden Gems", "Blind Spots", "Red Flags"].map((subStep, subIndex) => (
                          <motion.li
                            key={subIndex}
                            variants={fadeInUp}
                            initial="initial"
                            animate="animate"
                            transition={{ delay: 0.1 * subIndex }}
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
            </AnimatePresence>
          </div>

          <div className="relative h-[500px]">
            {showMindMap && (
              <>
                <svg className="absolute inset-0 w-full h-full">
                  {mindMapNodes.map((node) => (
                    <motion.circle
                      key={node.id}
                      cx={node.x}
                      cy={node.y}
                      r={30}
                      fill={node.type === "gem" ? "#10B981" : node.type === "spot" ? "#F59E0B" : "#EF4444"}
                      variants={pulseAnimation}
                      initial="initial"
                      animate="animate"
                    />
                  ))}
                  {mindMapNodes.map((node, index) => (
                    <motion.line
                      key={`line-${index}`}
                      x1={250}
                      y1={250}
                      x2={node.x}
                      y2={node.y}
                      stroke="#94A3B8"
                      strokeWidth={2}
                      variants={drawLine}
                      initial="hidden"
                      animate="visible"
                    />
                  ))}
                </svg>
                {mindMapNodes.map((node) => (
                  <motion.div
                    key={node.id}
                    className="absolute w-40 p-2 bg-white rounded-lg shadow-md text-xs"
                    style={{ top: node.y - 20, left: node.x - 20 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center space-x-2">
                      {getInsightIcon(node.type)}
                      <span className="font-semibold">{node.text}</span>
                    </div>
                    <p className="mt-1 text-gray-600">{node.description}</p>
                  </motion.div>
                ))}
              </>
            )}
          </div>
        </div>

        <motion.div
          className="mt-8 p-4 bg-blue-50 rounded-lg"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 2 }}
        >
          <p className="text-sm text-blue-700 italic">
            &ldquo;The analysis you&apos;re about to receive would typically take an experienced insurance professional
            several hours to compile. Our AI completes this in minutes, providing you with rapid, comprehensive insights
            into your policy.&rdquo;
          </p>
        </motion.div>

        {progress >= 60 && (
          <motion.div
            className="mt-8 flex justify-center space-x-4"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="flex items-center space-x-2 text-green-600">
              <Mail className="w-5 h-5" />
              <span>Email Summary</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-600">
              <FileText className="w-5 h-5" />
              <span>Expert PDF Report</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}


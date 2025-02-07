"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Eye, AlertTriangle, Shield, DollarSign, TrendingUp, Gift } from "lucide-react"

// const steps: Step[] = [
//   { id: 1, text: "Initial Launch Phase", icon: CheckCircle, duration: 10 },
//   { id: 2, text: "Framework Expansion", icon: Star, duration: 15 },
//   { id: 3, text: "Deep Analysis Phase", icon: Eye, duration: 20 },
//   { id: 4, text: "Final Phase", icon: AlertTriangle, duration: 30 },
// ]

const categories = [
  { id: "protection", text: "Protection Structure", icon: Shield },
  { id: "premium", text: "Premium & Funding", icon: DollarSign },
  { id: "growth", text: "Growth & Value Features", icon: TrendingUp },
  { id: "benefits", text: "Policy Benefits & Riders", icon: Gift },
]

const lenses = [
  {
    id: "gems",
    text: "Hidden Gems",
    description: "Valuable policy features you might not know about",
    color: "text-blue-500",
  },
  {
    id: "spots",
    text: "Blind Spots",
    description: "Areas that need a closer look as your life changes",
    color: "text-yellow-500",
  },
  { id: "flags", text: "Red Flags", description: "Specific items to review with your advisor", color: "text-red-500" },
]

export default function ProcessingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState("")
  const [showLenses, setShowLenses] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [showEmailPreview, setShowEmailPreview] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)

  useEffect(() => {
    const totalDuration = 75000 // 75 seconds
    const interval = 100 // Update every 100ms for smoother animations
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

    return () => clearInterval(progressInterval)
  }, [])

  useEffect(() => {
    const updateStep = () => {
      if (progress < 13.33) {
        setCurrentStep(0)
        if (progress < 4) {
          setCurrentMessage("Insurance Planner AI is beginning analysis...")
        } else if (progress < 8) {
          setCurrentMessage("Our AI examines your policy through three critical lenses:")
        } else {
          setShowLenses(true)
        }
      } else if (progress < 33.33) {
        setCurrentStep(1)
      } else if (progress < 60) {
        setCurrentStep(2)
        setShowCategories(true)
        if (progress > 46.67) {
          setShowEmailPreview(true)
        }
      } else {
        setCurrentStep(3)
        setShowDashboard(true)
      }
    }

    updateStep()
  }, [progress])

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => router.push("/dashboard"), 2000)
    }
  }, [progress, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-100 p-4">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">Analyzing Your Policy</h1>

        <div className="mb-8">
          <div className="h-2 w-full bg-gradient-to-r from-blue-200 to-blue-400 rounded-full">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-center text-lg font-semibold text-gray-700 mt-2">
            Estimated time: {Math.max(0, Math.ceil(75 - (progress / 100) * 75))} seconds remaining
          </p>
        </div>

        <AnimatePresence>
          <motion.div
            key={currentMessage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-xl text-center text-blue-700 font-semibold mb-6"
          >
            {currentMessage}
          </motion.div>
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <AnimatePresence>
              {showLenses &&
                lenses.map((lens, index) => (
                  <motion.div
                    key={lens.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.5 }}
                    className="flex items-start space-x-4"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${lens.color}`}>
                      {lens.id === "gems" && <Star className="w-6 h-6" />}
                      {lens.id === "spots" && <Eye className="w-6 h-6" />}
                      {lens.id === "flags" && <AlertTriangle className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className={`font-semibold ${lens.color}`}>{lens.text}</p>
                      <p className="text-sm text-gray-600">{lens.description}</p>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>

          <div className="space-y-6">
            <AnimatePresence>
              {showCategories &&
                categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.5 }}
                    className="flex items-center space-x-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <category.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="font-semibold text-gray-700">{category.text}</p>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {showEmailPreview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-4 bg-blue-100 rounded-lg"
            >
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                Your Insurance Planner AI Analysis Package is being prepared:
              </h3>
              <ul className="list-disc list-inside text-blue-600">
                <li>Comprehensive Policy Analysis</li>
                <li>Key Feature Assessment</li>
                <li>Risk & Opportunity Review</li>
                <li>Discussion Points for Your Advisor</li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showDashboard && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 space-y-4">
              <h3 className="text-xl font-semibold text-blue-700">Preparing your interactive dashboard...</h3>
              {["Overview", "Policy Details", "AI Analysis", "Projections"].map((section, index) => (
                <motion.div
                  key={section}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.5 }}
                  className="p-4 bg-gray-100 rounded-lg"
                >
                  {section}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <p className="text-lg font-semibold">
            &ldquo;The analysis you&apos;re about to receive would typically take an experienced insurance professional
            several hours to compile. Our AI completes this in minutes, providing you with rapid, comprehensive insights
            into your policy.&rdquo;
          </p>
        </motion.div>
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold text-blue-700">Current Step: {currentStep + 1} / 4</p>
        </div>
      </div>
    </div>
  )
}


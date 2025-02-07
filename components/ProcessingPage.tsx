"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { CheckCircle, Star, Eye, AlertTriangle, FileText, BarChart, PieChart, TrendingUp } from "lucide-react"
import type React from "react" // Import React

type SlideContent =
  | string[]
  | { text: string; description: string; icon: React.ElementType; color: string }[]
  | { email: string[]; pdf: string[] }

interface Slide {
  id: number
  title: string
  subtext: string
  content: SlideContent
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Analyzing Your Policy",
    subtext: "We're unlocking the value in your insurance policy.",
    content: [
      "Insurance Planner AI is analyzing your unique policy structure.",
      "Converting complex details into clear, actionable insights.",
      "Preparing comprehensive analysis that typically takes professionals hours.",
    ],
  },
  {
    id: 2,
    title: "Our AI's Analytical Approach",
    subtext: "Each policy is examined through three powerful lenses.",
    content: [
      {
        text: "Hidden Gems",
        description: "Valuable policy features you might not know about.",
        icon: Star,
        color: "text-blue-500",
      },
      {
        text: "Blind Spots",
        description: "Areas that need a closer look as your life changes.",
        icon: Eye,
        color: "text-yellow-500",
      },
      {
        text: "Red Flags",
        description: "Specific items to review with your advisor.",
        icon: AlertTriangle,
        color: "text-red-500",
      },
    ],
  },
  {
    id: 3,
    title: "Your AI Analysis Package is Being Prepared",
    subtext: "Two detailed reports tailored to your policy's unique features.",
    content: {
      email: ["Quick policy overview", "Key protection features", "Built-in advantages", "Action items"],
      pdf: ["In-depth analysis", "Feature assessment", "Risk & opportunity review", "Advisor discussion guide"],
    },
  },
  {
    id: 4,
    title: "Your Interactive Experience",
    subtext: "Explore your policy insights through our intuitive dashboard.",
    content: [
      { text: "Overview", description: "Your policy at a glance.", icon: PieChart, color: "text-blue-500" },
      { text: "Policy Details", description: "Deep dive into your coverage.", icon: FileText, color: "text-blue-500" },
      { text: "AI Analysis", description: "Insights and recommendations.", icon: BarChart, color: "text-blue-500" },
      { text: "Projections", description: "Future value and growth.", icon: TrendingUp, color: "text-blue-500" },
    ],
  },
  {
    id: 5,
    title: "Analysis Complete",
    subtext: "Your personalized policy insights are ready.",
    content: [
      "Your Insurance Planner AI Analysis is Complete.",
      "Check your inbox for your comprehensive analysis package.",
      "Preparing your personalized dashboard experience...",
    ],
  },
]

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

const transition = { duration: 0.5 }

export default function ProcessingPage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(0)

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
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev))
    }, 15000) // Change slide every 15 seconds

    return () => clearInterval(slideInterval)
  }, [])

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => router.push("/dashboard"), 2000)
    }
  }, [progress, router])

  const currentSlideData = slides[currentSlide]

  const renderContent = (content: SlideContent) => {
    if (Array.isArray(content)) {
      if (typeof content[0] === "string") {
        return (
          <ul className="space-y-4">
            {content.map((item, index) => (
              <motion.li
                key={index}
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.5 }}
              >
                <CheckCircle className="text-green-500" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        )
      } else {
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.map((item, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.5 }}
              >
                <item.icon className={`w-12 h-12 ${item.color} mb-2`} />
                <h3 className={`font-semibold ${item.color} mb-1`}>{item.text}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        )
      }
    } else {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div className="space-y-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 className="font-semibold text-blue-600">Clear Email Summary</h3>
            <ul className="list-disc list-inside">
              {content.email.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </motion.div>
          <motion.div className="space-y-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 className="font-semibold text-blue-600">Expert PDF Report</h3>
            <ul className="list-disc list-inside">
              {content.pdf.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </motion.div>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-100 p-4">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8">
        <motion.h1
          key={`title-${currentSlide}`}
          className="text-4xl font-bold text-center text-blue-600 mb-2"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
        >
          {currentSlideData.title}
        </motion.h1>
        <motion.p
          key={`subtext-${currentSlide}`}
          className="text-xl text-center text-blue-400 mb-6"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
        >
          {currentSlideData.subtext}
        </motion.p>

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

        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentSlide}`}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={fadeInUp}
            transition={transition}
          >
            {renderContent(currentSlideData.content)}
          </motion.div>
        </AnimatePresence>

        <motion.div
          className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <p className="text-lg font-semibold">
            &ldquo;The analysis you&apos;re about to receive would typically take an experienced insurance professional
            several hours to compile. Our AI completes this in minutes, providing you with rapid, comprehensive insights
            into your policy.&rdquo;
          </p>
        </motion.div>
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold text-blue-700">
            Step {currentSlide + 1} of {slides.length}
          </p>
        </div>
      </div>
    </div>
  )
}


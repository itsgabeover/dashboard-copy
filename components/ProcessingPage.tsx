"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import {
  CheckCircle,
  Star,
  Eye,
  AlertTriangle,
  FileText,
  BarChart,
  PieChart,
  TrendingUp,
  Mail,
  FileCheck,
  Inbox,
  Activity,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReactNode } from "react"

// Define more specific types for content
type StringContent = string[]
type IconContent = Array<{
  text: string
  description: string
  icon: React.ElementType
  color: string
}>
type EmailPdfContent = {
  email: string[]
  pdf: string[]
}

type SlideContent = StringContent | IconContent | EmailPdfContent

// Type guard functions
function isStringArray(content: SlideContent): content is StringContent {
  return Array.isArray(content) && typeof content[0] === "string"
}

function isIconArray(content: SlideContent): content is IconContent {
  return Array.isArray(content) && typeof content[0] === "object" && "icon" in content[0]
}

function isEmailPdfContent(content: SlideContent): content is EmailPdfContent {
  return !Array.isArray(content) && "email" in content && "pdf" in content
}

interface Slide {
  id: number
  title: string
  subtext: string
  content: SlideContent
  preamble?: string
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Analyzing Your Policy",
    subtext: "We're unlocking the value in your insurance policy.",
    preamble:
      "The analysis you're about to receive would typically take an experienced insurance professional several hours to compile. Our AI completes this in minutes, providing you with rapid, comprehensive insights into your policy.",
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
    title: "Discover Your Policy's Potential",
    subtext: "Your AI-powered analysis journey is just beginning",
    content: [
      {
        text: "In Your Inbox",
        description: "Access your comprehensive analysis package.",
        icon: Inbox,
        color: "text-blue-500",
      },
      {
        text: "Email Summary",
        description: "Quick insights and key findings.",
        icon: Mail,
        color: "text-blue-500",
      },
      {
        text: "PDF Report",
        description: "Detailed analysis and recommendations.",
        icon: FileCheck,
        color: "text-blue-500",
      },
      {
        text: "Interactive Dashboard",
        description: "Real-time tracking and insights.",
        icon: Activity,
        color: "text-blue-500",
      },
    ],
  },
]

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

const staggerItems: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.8,
    },
  },
}

const itemFade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
}

export default function ProcessingPage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const totalDuration = 100000 // 100 seconds
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
    }, 20000) // Change slide every 20 seconds

    return () => clearInterval(slideInterval)
  }, [])

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => router.push("/dashboard"), 2000)
    }
  }, [progress, router])

  const currentSlideData = slides[currentSlide]

  const renderContent = (content: SlideContent): ReactNode => {
    if (isStringArray(content)) {
      return (
        <motion.ul className="space-y-6" variants={staggerItems} initial="initial" animate="animate">
          {content.map((item, index) => (
            <motion.li key={index} className="flex items-center space-x-3" variants={itemFade}>
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">{item}</span>
            </motion.li>
          ))}
        </motion.ul>
      )
    }

    if (isIconArray(content)) {
      return (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerItems}
          initial="initial"
          animate="animate"
        >
          {content.map((item, index) => (
            <motion.div key={index} className="relative group" variants={itemFade}>
              <Card className="h-full transition-all duration-300 hover:shadow-lg">
                <CardHeader className="space-y-4 text-center">
                  <div className="mx-auto rounded-full bg-blue-50 p-3 transition-colors duration-300 group-hover:bg-blue-100">
                    <item.icon className={`w-8 h-8 ${item.color}`} />
                  </div>
                  <CardTitle className={`text-lg font-semibold ${item.color}`}>{item.text}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 text-center">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )
    }

    if (isEmailPdfContent(content)) {
      return (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={staggerItems}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={itemFade}>
            <Card className="h-full transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-lg font-semibold text-blue-500">Clear Email Summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {content.email.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemFade}>
            <Card className="h-full transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <FileCheck className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-lg font-semibold text-blue-500">Expert PDF Report</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {content.pdf.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )
    }

    return null
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-100 p-4">
      <div className="max-w-5xl w-full bg-white rounded-xl shadow-lg p-8">
        <motion.h1
          key={`title-${currentSlide}`}
          className="text-4xl font-bold text-center text-blue-600 mb-2"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          exit="exit"
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
        >
          {currentSlideData.subtext}
        </motion.p>

        <div className="mb-8">
          <div className="h-2 w-full bg-gradient-to-r from-blue-100 to-blue-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="mt-4 text-center space-y-2">
            <p className="text-lg font-semibold text-gray-700">
              Estimated time: {Math.max(0, Math.ceil(100 - (progress / 100) * 100))} seconds remaining
            </p>
            {currentSlideData.preamble && (
              <p className="text-sm text-gray-600 max-w-2xl mx-auto">{currentSlideData.preamble}</p>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentSlide}`}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={fadeInUp}
            className="min-h-[300px] flex items-center justify-center"
          >
            {renderContent(currentSlideData.content)}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 text-center">
          <p className="text-lg font-semibold text-blue-700">
            Step {currentSlide + 1} of {slides.length}
          </p>
        </div>
      </div>
    </div>
  )
}


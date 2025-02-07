"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, type Variants } from "framer-motion"
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
  Activity,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReactNode } from "react"

interface IconContent {
  text: string
  description: string
  icon: React.ElementType
  color: string
}

interface EmailPdfContent {
  email: string[]
  pdf: string[]
}

type SlideContent = string[] | IconContent[] | EmailPdfContent

interface Slide {
  id: number
  title: string
  subtext: string
  preamble?: string
  postamble?: string
  content: SlideContent
}

const isStringArray = (content: SlideContent): content is string[] =>
  Array.isArray(content) && typeof content[0] === "string"

const isIconArray = (content: SlideContent): content is IconContent[] =>
  Array.isArray(content) && typeof content[0] === "object" && "icon" in content[0]

const isEmailPdfContent = (content: SlideContent): content is EmailPdfContent =>
  !Array.isArray(content) && "email" in content && "pdf" in content

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
    preamble:
      "Our AI engine examines your policy through three critical lenses to transform complex details into clear, actionable insights:",
    content: [
      {
        text: "Hidden Gems",
        description: "Valuable policy features you might not know about.",
        icon: Star,
        color: "text-[#4B6FEE]",
      },
      {
        text: "Blind Spots",
        description: "Areas that need a closer look as your life changes.",
        icon: Eye,
        color: "text-[#4B6FEE]",
      },
      {
        text: "Red Flags",
        description: "Specific items to review with your advisor.",
        icon: AlertTriangle,
        color: "text-[#4B6FEE]",
      },
    ],
  },
  {
    id: 3,
    title: "Preparing Your AI Analysis Package",
    subtext: "Two detailed reports tailored to your policy's unique features.",
    preamble: "Comprehensive insights for you and your advisor.",
    content: {
      email: ["Quick policy overview", "Key protection features", "Built-in advantages", "Action items"],
      pdf: ["In-depth analysis", "Feature assessment", "Risk & opportunity review", "Advisor discussion guide"],
    },
  },
  {
    id: 4,
    title: "Your Interactive Experience",
    subtext: "Explore your policy insights through our intuitive dashboard.",
    preamble: "Your personalized dashboard puts powerful insights at your fingertips",
    content: [
      { text: "Overview", description: "Your policy at a glance.", icon: PieChart, color: "text-[#4B6FEE]" },
      { text: "Policy Details", description: "Deep dive into your coverage.", icon: FileText, color: "text-[#4B6FEE]" },
      { text: "AI Analysis", description: "Insights and recommendations.", icon: BarChart, color: "text-[#4B6FEE]" },
      { text: "Projections", description: "Future value and growth.", icon: TrendingUp, color: "text-[#4B6FEE]" },
    ],
  },
  {
    id: 5,
    title: "Discover Your Policy's Potential",
    subtext: "Your AI-powered analysis journey is just beginning",
    preamble: "Your comprehensive analysis is ready and being delivered in three formats:",
    postamble: "Watch for your analysis package in your inbox as we prepare your interactive dashboard.",
    content: [
      {
        text: "Email Summary",
        description: "Quick insights and key findings.",
        icon: Mail,
        color: "text-[#4B6FEE]",
      },
      {
        text: "PDF Report",
        description: "Detailed analysis and recommendations.",
        icon: FileCheck,
        color: "text-[#4B6FEE]",
      },
      {
        text: "Interactive Dashboard",
        description: "Real-time tracking and insights.",
        icon: Activity,
        color: "text-[#4B6FEE]",
      },
    ],
  },
]

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeInOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.8, ease: "easeInOut" } },
}

const staggerItems: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.4,
    },
  },
}

const itemFade: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeInOut" } },
}

export default function ProcessingPage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = Math.min(prevProgress + 1, 100)
        return newProgress
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev < slides.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, 20000)

    return () => clearInterval(slideInterval)
  }, [])

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        void router.push("/dashboard")
      }, 2000)
    }
  }, [progress, router])

  const currentSlideData = slides[currentSlide]

  const renderContent = (content: SlideContent, slide: Slide): ReactNode => {
    if (isStringArray(content)) {
      return (
        <div className="max-w-3xl mx-auto w-full px-4">
          {slide.preamble && (
            <motion.p
              className="text-center text-gray-600 mb-8 text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {slide.preamble}
            </motion.p>
          )}
          <motion.ul className="space-y-6" variants={staggerItems} initial="initial" animate="animate">
            {content.map((item, index) => (
              <motion.li
                key={index}
                className="flex items-center space-x-4 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                variants={itemFade}
                custom={index}
              >
                <div className="flex-shrink-0 rounded-full bg-blue-50 p-3">
                  <CheckCircle className="h-6 w-6 text-[#4B6FEE]" />
                </div>
                <span className="text-gray-700 text-lg">{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      )
    }

    if (isIconArray(content)) {
      return (
        <div className="max-w-5xl mx-auto w-full px-4">
          {slide.preamble && (
            <motion.p
              className="text-center text-gray-600 mb-12 text-lg leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {slide.preamble}
            </motion.p>
          )}
          <motion.div
            className={`grid grid-cols-1 ${slide.id === 4 ? "md:grid-cols-2" : "md:grid-cols-3"} gap-8 justify-items-center`}
            variants={staggerItems}
            initial="initial"
            animate="animate"
          >
            {content.map((item, index) => (
              <motion.div
                key={index}
                className="w-full"
                variants={itemFade}
                custom={index}
                initial="initial"
                animate="animate"
              >
                <Card className="h-full transition-all duration-300 hover:shadow-md bg-white rounded-xl border-0">
                  <CardHeader className="space-y-4 text-center p-6">
                    <div className="mx-auto rounded-full bg-blue-50 p-4 w-16 h-16 flex items-center justify-center">
                      <item.icon className="w-8 h-8 text-[#4B6FEE]" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-[#4B6FEE]">{item.text}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )
    }

    if (isEmailPdfContent(content)) {
      return (
        <div className="max-w-5xl mx-auto w-full px-4">
          {slide.preamble && (
            <motion.p
              className="text-center text-gray-600 mb-12 text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {slide.preamble}
            </motion.p>
          )}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerItems}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={itemFade} initial="initial" animate="animate" transition={{ delay: 0.5 }}>
              <Card className="h-full transition-all duration-300 hover:shadow-md bg-white rounded-xl border-0">
                <CardHeader className="space-y-4 text-center p-6">
                  <div className="mx-auto rounded-full bg-blue-50 p-4 w-16 h-16 flex items-center justify-center">
                    <Mail className="w-8 h-8 text-[#4B6FEE]" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-[#4B6FEE]">Email Summary</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <ul className="space-y-3">
                    {content.email.map((item, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="flex-shrink-0 rounded-full bg-blue-50 p-1.5">
                          <CheckCircle className="h-4 w-4 text-[#4B6FEE]" />
                        </div>
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemFade} initial="initial" animate="animate" transition={{ delay: 0.7 }}>
              <Card className="h-full transition-all duration-300 hover:shadow-md bg-white rounded-xl border-0">
                <CardHeader className="space-y-4 text-center p-6">
                  <div className="mx-auto rounded-full bg-blue-50 p-4 w-16 h-16 flex items-center justify-center">
                    <FileCheck className="w-8 h-8 text-[#4B6FEE]" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-[#4B6FEE]">PDF Report</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <ul className="space-y-3">
                    {content.pdf.map((item, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="flex-shrink-0 rounded-full bg-blue-50 p-1.5">
                          <CheckCircle className="h-4 w-4 text-[#4B6FEE]" />
                        </div>
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-blue-100/50">
      <motion.div
        className="w-full max-w-7xl px-4 py-16"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeInUp}
      >
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="w-full max-w-md mb-4">
            <div className="h-4 bg-blue-100/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#4B6FEE]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-600">Progress: {progress}%</p>
        </div>
        <motion.div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#4B6FEE] mb-4">{currentSlideData.title}</h1>
          <p className="text-lg text-gray-600">{currentSlideData.subtext}</p>
        </motion.div>
        {renderContent(currentSlideData.content, currentSlideData)}
        {currentSlideData.postamble && (
          <motion.p
            className="text-center text-gray-600 mt-12 text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {currentSlideData.postamble}
          </motion.p>
        )}
      </motion.div>
    </div>
  )
}


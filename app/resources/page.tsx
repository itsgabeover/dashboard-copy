'use client'

import { useState } from 'react'
import { 
  BookOpen, 
  FileText, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  X 
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"

// Add type for resource content
type ResourceContent = {
  name: string
  type: string
  action: string
  link?: string
}

// Add type for resource
type Resource = {
  title: string
  icon: React.ElementType
  description: string
  content: ResourceContent[]
}

// Add type for FAQ question
type FAQQuestion = {
  question: string
  answer: React.ReactNode
}

// Add type for FAQ category
type FAQCategory = {
  category: string
  questions: FAQQuestion[]
}

export default function ResourcesPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
      setTimeout(() => {
        const element = document.getElementById(section)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }

  const resources: Resource[] = [
    {
      title: 'Practice Planning',
      icon: BookOpen,
      description: 'Must have Advisor Resources',
      content: [
        { name: 'Client Engagement Email', type: 'PDF', action: 'Download' },
        { name: 'IFL Request Form', type: 'PDF', action: 'Download' }
      ]
    },
    {
      title: 'Sample Reports',
      icon: FileText,
      description: 'Advisor Analysis and Client Summary',
      content: [
        { 
          name: 'Advisor Analysis', 
          type: 'PDF', 
          action: 'Download',
          link: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IP%20AI%20ANALYSIS%20Sample-70EjJp7rBVSnRVSXDpgynLK20VtqF0.html'
        },
        { 
          name: 'Client Summary', 
          type: 'PDF', 
          action: 'Download',
          link: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IP%20AI%20SUMMARY%20Sample-y2eG2cyjpvjXlp5MsXhv9J7RWA11Ld.html'
        }
      ]
    }
  ]

  // Rest of your faqs array remains the same...

  return (
    // Your JSX remains the same...
  )
}

import type React from "react"

export interface Step {
  id: number
  text: string
  icon: React.ElementType
  subSteps?: string[]
}

export interface InsightNode {
  id: string
  type: "gem" | "spot" | "flag"
  text: string
  description: string
}

export interface MindMapNode extends InsightNode {
  x: number
  y: number
  connections: string[]
}


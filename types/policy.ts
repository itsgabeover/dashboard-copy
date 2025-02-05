export interface ParsedPolicyData {
  data: {
    policyOverview: {
      productName: string
      carrierName: string
      policyDesign: string
      deathBenefit: number
      premiumAmount: number
    }
    riders: string[]
    categories: Category[]
    timePoints: TimePoint[]
  }
}

export interface Category {
  name: string
  score: number
  hiddenGem: string
  blindSpot: string
  redFlag: string
}

export interface TimePoint {
  year: number
  cashValue: number
  netSurrenderValue: number
}

export interface APIResponse {
  success: boolean
  data?: ParsedPolicyData
  message?: string
  error?: string
  details?: string
}


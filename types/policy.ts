export interface PolicyValue {
  timePoint: string
  values: {
    deathBenefitAmount: number
    cashValue: number
    netSurrenderValue: number
  }
}

export interface PolicySection {
  title: string
  quotes: string[]
  hiddengem: string | null
  blindspot: string | null
  redflag: string | null
  clientImplications: string | null
  content?: string // Added for compatibility with some components
  insights?: string[] // Added for compatibility with some components
}

export interface PolicyOverview {
  productName: string
  issuer: string
  productType: string
  deathBenefit: number
  annualPremium: number
  riders: string[]
  policyStatus?: string // Added this field as it was in the other type definition
}

export interface ParsedPolicyData {
  timestamp: string
  data: {
    policyOverview: PolicyOverview
    sections: PolicySection[]
    values: PolicyValue[]
    finalThoughts: string
  }
}

export interface APIResponse {
  success: boolean
  data: ParsedPolicyData
}


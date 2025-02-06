export interface PolicyValue {
  timePoint: string
  values: {
    cashValue: number
    netSurrenderValue: number
    deathBenefitAmount: number
  }
}

export interface PolicySection {
  title: string
  quotes: string[]
  redflag: string
  blindspot: string
  hiddengem: string
  clientImplications: string
}

export interface PolicyOverview {
  issuer: string
  riders: string[]
  productName: string
  productType: string
  deathBenefit: number
  annualPremium: number
}

export interface ParsedPolicyData {
  sessionId: string  // Added sessionId at root level
  data: {
    values: PolicyValue[]
    sections: PolicySection[]
    finalThoughts: string
    policyOverview: PolicyOverview
    email: string    // Added email inside data object
  }
  status: "completed" | string
  updated_at: string
  timestamp?: string // Added optional timestamp
}

export interface APIResponse {
  success: boolean
  data?: ParsedPolicyData
  error?: string
}

// New types to support the updated dashboard code
export interface Policy {
  policy_name: string
  created_at: string
  analysis_data: ParsedPolicyData
  email: string
  session_id: string  // Added to match Supabase schema
}

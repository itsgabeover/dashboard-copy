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

// Updated Policy interface with new fields from Supabase
export interface Policy {
  id: string               // Added from Supabase
  policy_name: string
  created_at: string
  analysis_data: ParsedPolicyData
  status: string          // Added from Supabase
  updated_at: string      // Added from Supabase
  email: string
  session_id: string
}

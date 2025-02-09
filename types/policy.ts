// Core policy data structures
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

// Matches the analysis_data JSONB column in policies table
export interface ParsedPolicyData {
  sessionId: string
  data: {
    values: PolicyValue[]
    sections: PolicySection[]
    finalThoughts: string
    policyOverview: PolicyOverview
    email: string
  }
  status: "completed" | string
  updated_at: string
  timestamp?: string
}

// Matches Supabase policies table structure
export interface Policy {
  id: string // UUID from Supabase
  policy_name: string
  created_at: string
  analysis_data: ParsedPolicyData
  status: string
  updated_at: string
  email: string
  session_id: string
}

export interface APIResponse {
  success: boolean
  data?: ParsedPolicyData
  error?: string
}

// Database query helper types
export interface PolicyQueryResponse {
  data: Policy | null
  error: Error | null
}

// RLS policy types
export interface PolicyRLSContext {
  user_email: string
  session_id: string
}


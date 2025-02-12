// Core dashboard data structures
export interface PolicyBullet {
  title: string
  content: string
}

export interface PolicySection {
  title: string
  opening: string
  bullets: PolicyBullet[]
}

export interface PolicyOverview {
  productName: string
  issuer: string
  productType: string
  deathBenefit: number
  annualPremium: number
}

export interface PolicySections {
  policyOverview: PolicySection
  protectionGlance: PolicySection
  policyPower: PolicySection
  builtInAdvantages: PolicySection
  protectionInsights: PolicySection
  keyTopics: PolicySection
  pathForward: PolicySection
}

// Matches the analysis_data JSONB column in policy_dashboards table
export interface ParsedDashboardData {
  timestamp: string
  sessionId: string
  data: {
    policyOverview: PolicyOverview
    sections: PolicySections
    email: string
  }
}

// Matches Supabase policy_dashboards table structure
export interface PolicyDashboard {
  id: string // UUID from Supabase
  policy_name: string
  created_at: string
  analysis_data: ParsedDashboardData
  status: string
  updated_at: string
  email: string
  session_id: string
}

// API response types
export interface APIResponse {
  success: boolean
  data?: ParsedDashboardData
  error?: string
  details?: string
}

// Database query helper types
export interface DashboardQueryResponse {
  data: PolicyDashboard | null
  error: Error | null
}

// RLS policy types
export interface DashboardRLSContext {
  user_email: string
  session_id: string
}


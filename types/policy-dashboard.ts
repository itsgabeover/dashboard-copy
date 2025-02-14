// types/policy-dashboard.ts

// Core dashboard data structures
export interface PolicyBullet {
  title: string
  content: string
}

export interface PolicySection {
  title: string
  opening?: string
  bullets: PolicyBullet[]
}

// Direct policy overview data structure that exists at the top level
export interface PolicyOverviewData {
  issuer: string
  productName: string
  productType: string
  deathBenefit: string
  annualPremium: string
}

// Policy sections including the one in the sections array
export interface PolicySections {
  policyOverview: PolicySection
  policyPower: PolicySection
  builtInAdvantages: PolicySection
  protectionInsights: PolicySection
  keyTopics: PolicySection
  pathForward: PolicySection
  protectionGlance?: PolicySection
}

// Full dashboard data structure
export interface ParsedDashboardData {
  timestamp: string
  sessionId: string
  data: {
    email: string
    sections: PolicySections
    policyOverview: PolicyOverviewData
  }
}

// Matches Supabase policy_dashboards table structure
export interface PolicyDashboard {
  id: string // UUID from Supabase
  email: string
  policy_name: string
  created_at: string
  session_id: string
  analysis_data: ParsedDashboardData
  status?: string
  updated_at?: string
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

// Core dashboard data structures
export interface DashboardSection1 {
  title: string
  content: string[]
}

export interface DashboardSection2 {
  title: string
  content: string[]
}

export interface StaticSection {
  title: string
  content: string
}

export interface DashboardContent {
  atAGlance: {
    overview: DashboardSection1
    keyFeatures: DashboardSection2
  }
  coverage: {
    protection: DashboardSection1
    requirements: DashboardSection2
  }
  features: {
    primary: DashboardSection1
    static: StaticSection
  }
  planning: {
    topics: DashboardSection1
    static: StaticSection
  }
  management: {
    tasks: DashboardSection1
    static: StaticSection
  }
}

// Matches the analysis_data JSONB column in policy_dashboards table
export interface ParsedDashboardData {
  sessionId: string
  data: {
    policyName: string
    dashboardContent: DashboardContent
    email: string
  }
  status: "completed" | string
  updated_at: string
  timestamp?: string
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

export interface APIResponse {
  success: boolean
  data?: ParsedDashboardData
  error?: string
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

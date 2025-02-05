// Define the structure for policy overview
export interface PolicyOverview {
  productName: string
  carrierName: string
  policyDesign: string
  deathBenefit: number
  premiumAmount: number
}

// Define the structure for a category
export interface Category {
  name: string
  score: number
  hiddenGem: string
  blindSpot: string
  redFlag: string
}

// Define the structure for a policy section
export interface PolicySection {
  title: string
  hiddengem: string
  blindspot: string
  redflag: string
  clientImplications: string
}

// Define the structure for a time point
export interface TimePoint {
  year: number
  cashValue: number
  netSurrenderValue: number
}

// Define the main structure for parsed policy data
export interface ParsedPolicyData {
  data: {
    policyOverview: PolicyOverview
    riders: string[]
    categories: Category[]
    timePoints: TimePoint[]
    sections: PolicySection[]
  }
}

// Define the structure for API responses
export interface APIResponse {
  success: boolean
  data?: ParsedPolicyData
  message?: string
  error?: string
  details?: string
}

// Define any additional types or interfaces that might be needed
export interface PolicyAnalysis {
  overallScore: number
  recommendations: string[]
}

export interface UserProfile {
  id: string
  name: string
  email: string
  policies: string[] // Array of policy IDs
}

// Export any constants or enums related to policies
export enum PolicyStatus {
  Active = "active",
  Lapsed = "lapsed",
  Cancelled = "cancelled",
  Pending = "pending",
}

export const MAX_POLICY_TERM = 100 // Maximum policy term in years

// Export any utility types that might be useful
export type PolicyId = string
export type CarrierId = string

export interface CarrierInfo {
  id: CarrierId
  name: string
  rating: string
}

// Export a type for policy comparison
export interface PolicyComparison {
  policyA: ParsedPolicyData
  policyB: ParsedPolicyData
  differences: {
    [key: string]: {
      policyA: any
      policyB: any
    }
  }
}

// Export a type for historical policy data
export interface HistoricalPolicyData {
  policyId: PolicyId
  snapshots: Array<{
    date: string
    data: ParsedPolicyData
  }>
}

// Export any additional utility types or interfaces that might be needed for the application
export type Currency = "USD" | "EUR" | "GBP" | "JPY"

export interface MonetaryValue {
  amount: number
  currency: Currency
}

export interface RiderDetails {
  name: string
  description: string
  cost: MonetaryValue
}

// Extend the PolicyOverview to include more detailed financial information
export interface DetailedPolicyOverview extends PolicyOverview {
  cashValue: MonetaryValue
  surrenderValue: MonetaryValue
  riders: RiderDetails[]
}

// Define a type for policy search parameters
export interface PolicySearchParams {
  carrierName?: string
  policyType?: string
  minDeathBenefit?: number
  maxPremium?: number
  status?: PolicyStatus
}

// Define a type for pagination
export interface PaginationParams {
  page: number
  limit: number
  totalPages: number
  totalItems: number
}

// Define a type for sorted and paginated policy results
export interface PolicySearchResult {
  policies: ParsedPolicyData[]
  pagination: PaginationParams
}

// Export all types and interfaces
export type {
  PolicyOverview,
  Category,
  PolicySection,
  TimePoint,
  ParsedPolicyData,
  APIResponse,
  PolicyAnalysis,
  UserProfile,
  CarrierInfo,
  PolicyComparison,
  HistoricalPolicyData,
  MonetaryValue,
  RiderDetails,
  DetailedPolicyOverview,
  PolicySearchParams,
  PaginationParams,
  PolicySearchResult,
}


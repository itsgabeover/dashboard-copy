export interface ParsedPolicyData {
  timestamp: string
  data: {
    policyOverview: PolicyOverview
    sections: PolicySection[]
    finalThoughts?: string
  }
}

export interface PolicyOverview {
  policyName: string
  insuranceCompany: string
  policyType: string
  faceAmount: string
  premiumAmount: string
  cashValue: string
}

export interface PolicySection {
  title: string
  content: string
  insights: string[]
}

export interface Policy {
  id: string
  created_at: string
  status: string
  productName: string
  analysis_data: {
    policyName: string
  }
}


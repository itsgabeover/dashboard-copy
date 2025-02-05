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
  data: {
    values: PolicyValue[]
    sections: PolicySection[]
    finalThoughts: string
    policyOverview: PolicyOverview
  }
  status: 'completed' | string
  updated_at: string
}

export interface APIResponse {
  success: boolean
  data?: ParsedPolicyData
  error?: string
}

export interface ParsedPolicyData {
  timestamp: string;
  data: {
    policyOverview: {
      productName: string;
      issuer: string;
      productType: string;
      deathBenefit: number;
      annualPremium: number;
      riders: string[];
    };
    sections: Array<{
      title: string;
      quotes: string[];
      hiddengem: string | null;
      blindspot: string | null;
      redflag: string | null;
      clientImplications: string | null;
    }>;
    values: Array<{
      timePoint: string;
      values: {
        deathBenefitAmount: number;
        cashValue: number;
        netSurrenderValue: number;
      };
    }>;
    finalThoughts?: string;
  };
}

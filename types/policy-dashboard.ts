// @/types/policy-dashboard.ts
export interface DashboardSection {
  title: string;
  content: string[];
}

export interface ParsedDashboardData {
  timestamp: string;
  sessionId: string;
  data: {
    policyName: string;
    atAGlance: {
      section1: DashboardSection;
      section2: DashboardSection;
    };
    coverage: {
      section1: DashboardSection;
      section2: DashboardSection;
    };
    features: {
      section1: DashboardSection;
      section2: { title: string; content: string }; // Static content
    };
    planning: {
      section1: DashboardSection;
      section2: { title: string; content: string }; // Static content
    };
    management: {
      section1: DashboardSection;
      section2: { title: string; content: string }; // Static content
    };
  };
}

export type APIResponse = {
  success: boolean;
  data?: ParsedDashboardData;
  error?: string;
  details?: string;
};

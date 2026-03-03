// Chart data types
export interface MembershipGrowthData {
  year: string;
  memberCount: number;
  growthRate: number;
}

export interface MemberCountBySubdistrictData {
  subdistrict: string;
  memberCount: number;
  percentage: number;
}

export interface SharesDistributionData {
  bucket: string;
  memberCount: number;
  percentage: number;
}

// Recharts tooltip props
export interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number;
    payload?: MembershipGrowthData | MemberCountBySubdistrictData | SharesDistributionData;
    fill?: string;
  }>;
}

export interface XAxisTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string;
  };
  index?: number;
}

export interface LabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}

export interface IDashboardOverview {
  kpi: {
    totalMembers: number;
    totalShares: number;
    averageSharesPerPerson: number;
    membersThisYear: {
      currentCount: number;
      lastYearCount: number;
      memberChange: number;
    };
  };
  charts: {
    sharesDistribution: {
      data: SharesDistributionData[];
    };
    memberCountBySubdistrict: {
      data: MemberCountBySubdistrictData[];
    };
    membershipGrowth: {
      data: MembershipGrowthData[];
    };
  };
}

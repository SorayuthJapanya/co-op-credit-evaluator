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
      data: {
        bucket: string;
        memberCount: number;
        percentage: number;
      }[];
    };
    memberCountBySubdistrict: {
      data: {
        subdistrict: string;
        memberCount: number;
        percentage: number;
      }[];
    };
    membershipGrowth: {
      data: {
        year: string;
        memberCount: number;
        growthRate: number;
      }[];
    };
  };
}

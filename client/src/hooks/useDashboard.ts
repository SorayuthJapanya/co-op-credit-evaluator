import { useQuery } from "@tanstack/react-query";
import {
  getDashboardOverviewData,
  getSubdistrictData,
} from "@/services/dashboardService";

export const useDashboardOverview = (
  accountYear: string,
  subdistrictCode: string
) => {
  return useQuery({
    queryKey: ["dashboard-overview", accountYear, subdistrictCode],
    queryFn: () =>
      getDashboardOverviewData({ accountYear, subdistrict: subdistrictCode }),
    refetchOnWindowFocus: false,
  });
};

export const useSubdistrictData = () => {
  return useQuery({
    queryKey: ["subdistrict-data"],
    queryFn: getSubdistrictData,
    refetchOnWindowFocus: false,
  });
};

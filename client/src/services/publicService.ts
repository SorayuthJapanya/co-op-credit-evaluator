import { axiosInstance } from "@/utils/axios";

export interface PublicKPIData {
  totalMembers: number;
  totalEvaluations: number;
  totalShares: number;
}

export const getPublicKPI = async (): Promise<PublicKPIData> => {
  const response = await axiosInstance.get("/public/kpi");
  return response.data;
};

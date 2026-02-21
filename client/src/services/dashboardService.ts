import { axiosInstance } from "@/utils/axios";

export const getDashboardOverviewData = async ({
  accountYear,
  subdistrict,
}: {
  accountYear: string;
  subdistrict: string;
}) => {
  const response = await axiosInstance.get("/protected/dashboard/overview", {
    params: {
      accountYear,
      subdistrict,
    },
  });
  return response.data;
};

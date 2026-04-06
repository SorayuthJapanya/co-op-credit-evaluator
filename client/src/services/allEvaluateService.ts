import { axiosInstance } from "@/utils/axios";

export const getAllEvaluates = async ({
  search,
  page,
  limit,
}: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await axiosInstance.get("/protected/all-evaluates", {
    params: {
      search,
      page,
      limit,
    },
  });
  return response.data;
};

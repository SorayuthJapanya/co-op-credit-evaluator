import { axiosInstance } from "@/utils/axios";

export const getAllEvaluates = async ({
  search,
  page,
  limit,
  userId,
}: {
  search?: string;
  page?: number;
  limit?: number;
  userId?: string;
}) => {
  const response = await axiosInstance.get("/protected/all-evaluates", {
    params: {
      search,
      page,
      limit,
      userId,
    },
  });
  return response.data;
};

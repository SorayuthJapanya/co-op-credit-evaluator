import type { ICreateEvaluate } from "@/types/evaluate_types";
import { axiosInstance } from "@/utils/axios";

export const createEvaluate = async (data: ICreateEvaluate) => {
  const response = await axiosInstance.post("/protected/evaluates", data);
  return response.data;
};

export const getEvaluates = async ({
  search,
  page,
  limit,
}: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await axiosInstance.get("/protected/evaluates", {
    params: {
      search,
      page,
      limit,
    },
  });
  return response.data;
};

export const getEvaluateById = async (id: string) => {
  const response = await axiosInstance.get(`/protected/evaluates/${id}`);
  return response.data;
};

export const updateEvaluate = async (id: string, data: ICreateEvaluate) => {
  const response = await axiosInstance.put(`/protected/evaluates/${id}`, data);
  return response.data;
};

export const deleteEvaluate = async (id: string) => {
  const response = await axiosInstance.delete(`/protected/evaluates/${id}`);
  return response.data;
};

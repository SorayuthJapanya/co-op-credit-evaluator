import { axiosInstance } from "@/utils/axios";
import type { IAdmin, IEvaluateLog, PaginationResponse } from "@/types/superadmin_types";
import type { RequestUser } from "@/types/auth_types";

export const createAdmin = async (user: RequestUser): Promise<{ message: string; data: IAdmin }> => {
  const response = await axiosInstance.post(`/protected/admins`, user);
  return response.data;
};

export const getAdmins = async ({
  search = "",
  page = 1,
  limit = 10,
}: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<PaginationResponse<IAdmin[]>> => {
  const response = await axiosInstance.get("/protected/admins", {
    params: { search, page, limit },
  });
  return response.data;
};

export const updateAdminRole = async (
  id: string,
  role: "ADMIN" | "SUPER_ADMIN"
): Promise<{ message: string; data: IAdmin }> => {
  const response = await axiosInstance.patch(`/protected/admins/${id}/role`, { role });
  return response.data;
};

export const getEvaluateLogs = async ({
  search = "",
  page = 1,
  limit = 10,
}: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<PaginationResponse<IEvaluateLog[]>> => {
  const response = await axiosInstance.get("/protected/evaluate-logs", {
    params: { search, page, limit },
  });
  return response.data;
};

export const deleteAdmin = async (id: string): Promise<{ message: string }> => {
  const response = await axiosInstance.delete(`/protected/admins/${id}`);
  return response.data;
};

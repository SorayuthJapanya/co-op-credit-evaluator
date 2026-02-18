import type { RequestUser, IUser } from "@/types/auth_types";

import { axiosInstance } from "../utils/axios";

export const getCurrentUser = async (): Promise<IUser | null> => {
  const response = await axiosInstance.get("/protected/me");
  return response.data.user;
};

export const registerUser = async (user: RequestUser) => {
  const response = await axiosInstance.post("/auth/register-admin", user);
  return response.data;
};

export const loginUser = async (user: RequestUser) => {
  const response = await axiosInstance.post("/auth/login-admin", user);
  return response.data;
};

export const logoutUser = async () => {
  const response = await axiosInstance.post("protected/logout");
  return response.data;
};

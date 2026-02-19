import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../services/auth";
import type { AxiosError } from "axios";
import Swal from "sweetalert2";

interface ApiErrorResponse {
  message: string;
}

export const useAuthUser = () => {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (response) => {
      Swal.fire({
        icon: "success",
        title: response.message || "ลงทะเบียนสำเร็จ",
      });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorData = error?.response?.data;
      Swal.fire({
        icon: "error",
        title: errorData?.message || "ลงทะเบียนไม่สำเร็จ",
      });
    },
  });
};

export const useLoginUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      Swal.fire({
        icon: "success",
        title: response.message || "เข้าสู่ระบบสำเร็จ",
      });
      // Invalidate authUser query to refetch with new auth state
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorData = error?.response?.data;
      Swal.fire({
        icon: "error",
        title: errorData?.message || "เข้าสู่ระบบไม่สำเร็จ",
      });
    },
  });
};

export const useLogoutUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: (response) => {
      Swal.fire({
        icon: "success",
        title: response.message || "ออกจากระบบสำเร็จ",
      });
      // Invalidate authUser query to refetch with new auth state
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorData = error?.response?.data;
      Swal.fire({
        icon: "error",
        title: errorData?.message || "ออกจากระบบไม่สำเร็จ",
      });
    },
  });
};

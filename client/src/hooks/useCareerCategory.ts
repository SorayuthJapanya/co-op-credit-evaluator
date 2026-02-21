import {
  createCareerCategory,
  createSubCareer,
  deleteCareerCategory,
  deleteSubCareer,
  getCareerCategories,
  getSubCategoriesByCategory,
  updateCareerCategory,
  updateSubCareer,
} from "@/services/careerCategoryService";
import type { IManageSubCareer } from "@/types/career_types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import Swal from "sweetalert2";

interface ApiErrorResponse {
  message: string;
}

// ------ Career Category ------

export const useGetCareerCategories = () => {
  return useQuery({
    queryKey: ["career-categories"],
    queryFn: getCareerCategories,
  });
};

export const useCreateCareerCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCareerCategory,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["career-categories"] });
      Swal.fire({
        icon: "success",
        title: response.message || "เพิ่มหมวดหมู่อาชีพสำเร็จ",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorData = error?.response?.data;
      Swal.fire({
        icon: "error",
        title: errorData?.message || "เกิดข้อผิดพลาด",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });
};

export const useUpdateCareerCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { categoryName: string };
    }) => updateCareerCategory(id, data),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["career-categories"] });
      Swal.fire({
        icon: "success",
        title: response.message || "แก้ไขหมวดหมู่อาชีพสำเร็จ",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorData = error?.response?.data;
      Swal.fire({
        icon: "error",
        title: errorData?.message || "เกิดข้อผิดพลาด",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });
};

export const useDeleteCareerCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCareerCategory(id),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["career-categories"] });
      Swal.fire({
        icon: "success",
        title: response.message || "ลบหมวดหมู่อาชีพสำเร็จ",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorData = error?.response?.data;
      Swal.fire({
        icon: "error",
        title: errorData?.message || "เกิดข้อผิดพลาด",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });
};

// ------ Sub Career ------

export const useGetSubCategoriesByCategory = (
  id: string | null,
  page: number = 1,
  limit: number = 10,
  search: string = "",
) => {
  return useQuery({
    queryKey: ["sub-categories", id, page, limit, search],
    queryFn: () =>
      getSubCategoriesByCategory(id as string, page, limit, search),
    enabled: !!id,
  });
};

export const useCreateSubCareer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubCareer,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
      Swal.fire({
        icon: "success",
        title: response.message || "เพิ่มอาชีพย่อยสำเร็จ",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorData = error?.response?.data;
      Swal.fire({
        icon: "error",
        title: errorData?.message || "เกิดข้อผิดพลาด",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });
};

export const useUpdateSubCareer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IManageSubCareer }) =>
      updateSubCareer(id, data),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
      Swal.fire({
        icon: "success",
        title: response.message || "แก้ไขอาชีพย่อยสำเร็จ",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorData = error?.response?.data;
      Swal.fire({
        icon: "error",
        title: errorData?.message || "เกิดข้อผิดพลาด",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });
};

export const useDeleteSubCareer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSubCareer(id),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
      Swal.fire({
        icon: "success",
        title: response.message || "ลบอาชีพย่อยสำเร็จ",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorData = error?.response?.data;
      Swal.fire({
        icon: "error",
        title: errorData?.message || "เกิดข้อผิดพลาด",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });
};

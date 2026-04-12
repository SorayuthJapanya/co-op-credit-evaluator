import {
  createEvaluate,
  getEvaluates,
  getEvaluateById,
  updateEvaluate,
  updateEvaluateStatus,
  deleteEvaluate,
} from "@/services/evaluateService";
import type { ICreateEvaluate } from "@/types/evaluate_types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import Swal from "sweetalert2";

interface ApiErrorResponse {
  message: string;
}

export const useCreateEvaluate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEvaluate,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["evaluates"] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorData = error?.response?.data;
      Swal.fire({
        icon: "error",
        title: errorData?.message || "เกิดข้อผิดพลาด",
        showConfirmButton: false,
        timer: 2000,
      });
    },
  });
};

export const useGetEvaluates = ({
  search,
  page,
  limit,
}: {
  search: string;
  page: number;
  limit: number;
}) => {
  return useQuery({
    queryKey: ["evaluates", search, page, limit],
    queryFn: () => getEvaluates({ search, page, limit }),
    refetchOnWindowFocus: false,
  });
};

export const useGetEvaluateById = (id: string) => {
  return useQuery({
    queryKey: ["evaluates", id],
    queryFn: () => getEvaluateById(id),
  });
};

export const useUpdateEvaluate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, id }: { data: ICreateEvaluate; id: string }) =>
      updateEvaluate(id, data),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["evaluates"] });
      Swal.fire({
        icon: "success",
        title: response?.message || "แก้ไขการประเมินสำเร็จ",
        showConfirmButton: false,
        timer: 2000,
      });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorData = error?.response?.data;
      Swal.fire({
        icon: "error",
        title: errorData?.message || "เกิดข้อผิดพลาด",
        showConfirmButton: false,
        timer: 2000,
      });
    },
  });
};

export const useUpdateEvaluateStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, feedback }: { id: string; status: string; feedback: string }) =>
      updateEvaluateStatus(id, status, feedback),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["evaluates"] }),
        queryClient.invalidateQueries({ queryKey: ["all-evaluates"] }),
      ]);
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorData = error?.response?.data;
      Swal.fire({
        icon: "error",
        title: errorData?.message || "เกิดข้อผิดพลาด",
        showConfirmButton: false,
        timer: 2000,
      });
    },
  });
};

export const useDeleteEvaluate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEvaluate(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["evaluates"] }),
        queryClient.invalidateQueries({ queryKey: ["all-evaluates"] }),
      ]);
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorData = error?.response?.data;
      Swal.fire({
        icon: "error",
        title: errorData?.message || "เกิดข้อผิดพลาด",
        showConfirmButton: false,
        timer: 2000,
      });
    },
  });
};

import { crateMember, deleteMember, getMemberById, getMembers, updateMember } from "@/services/memberServices";
import type { IFilterMemberRequest, IUpdateMemberRequest } from "@/types/member_types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import Swal from "sweetalert2";

interface ApiErrorResponse {
  message: string;
}

export const useMembers = ({
  fullName,
  subdistrict,
  district,
  province,
  limit,
  page,
}: IFilterMemberRequest) => {
  return useQuery({
    queryKey: [
      "members",
      fullName,
      subdistrict,
      district,
      province,
      limit,
      page,
    ],
    queryFn: () =>
      getMembers({ fullName, subdistrict, district, province, limit, page }),
    refetchOnWindowFocus: false,
  });
};

export const useMemberById = (id: string) => {
  return useQuery({
    queryKey: ["member", id],
    queryFn: () => getMemberById(id),
    refetchOnWindowFocus: false,
  });
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: crateMember,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["members"] });
      Swal.fire({
        icon: "success",
        title: response?.message || "เพิ่มสมาชิกสำเร็จ",
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

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({data, id}: {data: IUpdateMemberRequest, id: string}) => updateMember(data, id),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["members"] });
      Swal.fire({
        icon: "success",
        title: response.message || "แก้ไขสมาชิกสำเร็จ",
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

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMember,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["members"] });
      Swal.fire({
        icon: "success",
        title: response?.message || "ลบสมาชิกสำเร็จ",
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



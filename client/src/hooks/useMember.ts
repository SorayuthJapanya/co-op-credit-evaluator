import { CrateMember, DeleteMember, GetMemberById, getMembers, UpdateMember } from "@/services/memberServices";
import type { IFilterMemberRequest } from "@/types/member_types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

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
    queryFn: () => GetMemberById(id),
    refetchOnWindowFocus: false,
  });
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CrateMember,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["members"] });
      Swal.fire({
        icon: "success",
        title: response.message || "เพิ่มสมาชิกสำเร็จ",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: error.message || "เกิดข้อผิดพลาด",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UpdateMember,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["members"] });
      Swal.fire({
        icon: "success",
        title: response.message || "แก้ไขสมาชิกสำเร็จ",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: error.message || "เกิดข้อผิดพลาด",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: DeleteMember,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["members"] });
      Swal.fire({
        icon: "success",
        title: response.message || "ลบสมาชิกสำเร็จ",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: error.message || "เกิดข้อผิดพลาด",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });
};



import type {
  ICreateMemberRequest,
  IFilterMemberRequest,
  IUpdateMemberRequest,
} from "@/types/member_types";
import { axiosInstance } from "@/utils/axios";

export const getMembers = async ({
  fullName,
  subdistrict,
  district,
  province,
  limit,
  page,
}: IFilterMemberRequest) => {
  const response = await axiosInstance.get("/protected/members", {
    params: {
      fullName,
      subdistrict,
      district,
      province,
      limit,
      page,
    },
  });
  return response.data;
};

export const CrateMember = async (data: ICreateMemberRequest) => {
  const response = await axiosInstance.post("/protected/members", data);
  return response.data;
};

export const UpdateMember = async (data: IUpdateMemberRequest) => {
  const response = await axiosInstance.put("/protected/members", data);
  return response.data;
};

export const DeleteMember = async (id: string) => {
  const response = await axiosInstance.delete(`/protected/members/${id}`);
  return response.data;
};

export const GetMemberById = async (id: string) => {
  const response = await axiosInstance.get(`/protected/members/${id}`);
  return response.data;
};

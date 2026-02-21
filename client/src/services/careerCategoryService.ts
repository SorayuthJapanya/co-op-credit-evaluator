import type { IManageSubCareer } from "@/types/career_types";
import { axiosInstance } from "@/utils/axios";

// ------ Career Category ------

export const createCareerCategory = async (data: { categoryName: string }) => {
  const response = await axiosInstance.post(
    "/protected/career/categories",
    data,
  );
  return response.data;
};

export const getCareerCategories = async () => {
  const response = await axiosInstance.get("/protected/career/categories");
  return response.data.data;
};

export const updateCareerCategory = async (
  id: string,
  data: { categoryName: string },
) => {
  const response = await axiosInstance.put(
    `/protected/career/categories/${id}`,
    data,
  );
  return response.data;
};

export const deleteCareerCategory = async (id: string) => {
  const response = await axiosInstance.delete(
    `/protected/career/categories/${id}`,
  );
  return response.data;
};

// ------ Sub Career -----

export const getSubCategoriesByCategory = async (
  id: string,
  page: number = 1,
  limit: number = 10,
  search: string = "",
) => {
  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  if (search) params.append("search", search);

  const response = await axiosInstance.get(
    `/protected/career/categories/${id}/subcategories?${params.toString()}`,
  );
  return response.data;
};

export const createSubCareer = async (data: IManageSubCareer) => {
  const response = await axiosInstance.post(
    "/protected/career/subcategories",
    data,
  );
  return response.data;
};

export const updateSubCareer = async (id: string, data: IManageSubCareer) => {
  const response = await axiosInstance.put(
    `/protected/career/subcategories/${id}`,
    data,
  );
  return response.data;
};

export const deleteSubCareer = async (id: string) => {
  const response = await axiosInstance.delete(
    `/protected/career/subcategories/${id}`,
  );
  return response.data;
};

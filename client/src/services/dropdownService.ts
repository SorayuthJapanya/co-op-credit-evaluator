import { axiosInstance } from "../utils/axios";

export const getSubdistrictData = async () => {
  const response = await axiosInstance.get("/protected/dropdown/subdistricts");
  return response.data;
};

export const getDistrictData = async () => {
  const response = await axiosInstance.get("/protected/dropdown/districts");
  return response.data;
};

export const getProvinceData = async () => {
  const response = await axiosInstance.get("/protected/dropdown/provinces");
  return response.data;
};

export const getFullDropdownData = async () => {
  const response = await axiosInstance.get("/protected/dropdown/full");
  return response.data;
};
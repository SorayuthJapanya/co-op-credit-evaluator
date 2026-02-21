import { useQuery } from "@tanstack/react-query";
import {
  getDistrictData,
  getFullDropdownData,
  getProvinceData,
  getSubdistrictData,
} from "@/services/dropdownService";

export const useFullDropdownData = () => {
  return useQuery({
    queryKey: ["full-dropdown"],
    queryFn: getFullDropdownData,
  });
};

export const useSubdistrictData = () => {
  return useQuery({
    queryKey: ["subdistrict"],
    queryFn: getSubdistrictData,
  });
};

export const useDistrictData = () => {
  return useQuery({
    queryKey: ["district"],
    queryFn: getDistrictData,
  });
};

export const useProvinceData = () => {
  return useQuery({
    queryKey: ["province"],
    queryFn: getProvinceData,
  });
};

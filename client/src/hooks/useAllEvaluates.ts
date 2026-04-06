import { getAllEvaluates } from "@/services/allEvaluateService";
import { useQuery } from "@tanstack/react-query";

export const useGetAllEvaluates = ({
  search,
  page,
  limit,
}: {
  search: string;
  page: number;
  limit: number;
}) => {
  return useQuery({
    queryKey: ["all-evaluates", search, page, limit],
    queryFn: () => getAllEvaluates({ search, page, limit }),
    refetchOnWindowFocus: false,
  });
};

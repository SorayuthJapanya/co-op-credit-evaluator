import { getAllEvaluates } from "@/services/allEvaluateService";
import { useQuery } from "@tanstack/react-query";

export const useGetAllEvaluates = ({
  search,
  page,
  limit,
  userId,
}: {
  search: string;
  page: number;
  limit: number;
  userId?: string;
}) => {
  return useQuery({
    queryKey: ["all-evaluates", search, page, limit, userId],
    queryFn: () => getAllEvaluates({ search, page, limit, userId }),
    refetchOnWindowFocus: false,
  });
};

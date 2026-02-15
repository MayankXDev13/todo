import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "../api/categories/categories";
import type { GetCategoriesParams } from "../../types/category";

export const useGetAllCategories = (params?: GetCategoriesParams) => {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => getAllCategories(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};

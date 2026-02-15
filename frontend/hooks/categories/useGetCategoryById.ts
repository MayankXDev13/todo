import { getCategoryById } from "../api/categories/categories";
import { useQuery } from "@tanstack/react-query";

export const useGetCategoryById = (id: string) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id),
    enabled: !!id, // won't run if id is empty or undefined
  });
};

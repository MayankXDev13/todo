import { useQuery } from "@tanstack/react-query";
import { getAllTodos } from "../api/todo/todo";
import type { GetTodosParams } from "@/types/todo";

export const useGetAllTodos = (params?: GetTodosParams) => {
  return useQuery({
    queryKey: ["todos", params],
    queryFn: () => getAllTodos(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};
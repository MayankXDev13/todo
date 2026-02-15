import { useQuery } from "@tanstack/react-query";
import { getTodoById } from "../api/todo/todo";

export const useGetTodoById = (id: string) => {
  return useQuery({
    queryKey: ["todo", id],
    queryFn: () => getTodoById(id),
    enabled: !!id,
  });
};
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo } from "../api/todo/todo";
import { toast } from "sonner";

export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["todos"] });
      }
    },
    onError: (error) => {
      if (error instanceof Error) toast.error(error.message);
    },
  });
};
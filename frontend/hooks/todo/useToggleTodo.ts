import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleTodo } from "../api/todo/todo";
import { toast } from "sonner";

export const useToggleTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleTodo(id),
    onSuccess: (response) => {
      if (!response.success) return;
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["todo", response.data.id] }); // use id from response
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
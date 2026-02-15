import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTodo } from "../api/todo/todo";
import type { UpdateTodoPayload } from "@/types/todo";
import { toast } from "sonner";

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTodoPayload }) =>
      updateTodo(id, payload),
    onSuccess: (response) => {
      if (!response.success) return;
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["todo", response.data.id] }); //  use id from response
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "../api/categories/categories";
import { toast } from "sonner";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: (response) => {
      if (!response.success) return;
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

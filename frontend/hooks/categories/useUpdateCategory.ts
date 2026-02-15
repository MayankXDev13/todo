import { CreateCategoryPayload } from "@/types/category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory } from "../api/categories/categories";
import { toast } from "sonner";

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: CreateCategoryPayload;
    }) => updateCategory(id, payload),
    onSuccess: (response) => {
      if (!response.success) return;
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", response.data.id] }); // use id from response
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

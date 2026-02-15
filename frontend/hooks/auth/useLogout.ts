import { useAuthStore } from "@/stores/auth.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../api/auth/auth";
import { toast } from "sonner";

export const useLogout = () => {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: (response) => {
      if (!response.success) return;
      logout();
      queryClient.clear();
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
      logout();
      queryClient.clear();
    },
  });
};

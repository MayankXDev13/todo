import { useAuthStore } from "@/stores/auth.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginUser } from "../api/auth/auth";
import { toast } from "sonner";

export const useLogin = () => {
  const { login } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      if (!response.success) return;

      const { user, accessToken, refreshToken } = response.data;

      login(user, { accessToken, refreshToken });

      queryClient.setQueryData(["current-user"], user);

      toast.success(response.message);
      router.push("/todos");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

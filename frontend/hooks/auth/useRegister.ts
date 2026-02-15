import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/auth/auth";
import { toast } from "sonner";

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (response) => {
      if (!response.success) return;
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../api/auth/auth";
import { toast } from "sonner";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (response) => {
      if (!response.success) return;
      toast.success(response.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { verifyEmail } from "../api/auth/auth";

export function useVerifyEmail() {
  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

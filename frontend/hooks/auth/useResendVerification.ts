import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { resendVerification } from "../api/auth/auth";

export function useResendVerification() {
  return useMutation({
    mutationFn: resendVerification,
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

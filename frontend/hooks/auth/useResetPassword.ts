import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../api/auth/auth";
import { toast } from "sonner";

export function useResetPassword() {
  return useMutation({
    mutationFn: ({
      newPassword,
      resetToken,
    }: {
      newPassword: string;
      resetToken: string;
    }) => resetPassword(newPassword, resetToken),
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

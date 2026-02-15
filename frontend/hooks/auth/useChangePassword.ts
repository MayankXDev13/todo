import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { changePassword } from "../api/auth/auth";

export function useChangePassword() {
  return useMutation({
    mutationFn: ({
      newPassword,
      oldPassword,
    }: {
      newPassword: string;
      oldPassword: string;
    }) => changePassword(newPassword, oldPassword),
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

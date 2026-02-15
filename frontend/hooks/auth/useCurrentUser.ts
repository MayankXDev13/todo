import { useAuthStore } from "@/stores/auth.store";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/auth/auth";
import { useEffect } from "react";

export const useCurrentUser = () => {
  const { setCurrentUser } = useAuthStore();

  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
  });

  useEffect(() => {
    if (query.data?.success) {
      setCurrentUser(query.data.data);
    }
  }, [query.data, setCurrentUser]);

  return query;
};

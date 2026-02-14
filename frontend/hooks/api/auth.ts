'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient, handleApiError } from '@/lib/api';
import { ApiResponse } from '@/types/models';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';

// API functions
const loginUser = async (credentials: { email: string; password: string }) => {
  const { data } = await apiClient.post<ApiResponse<{
    user: {
      id: string;
      email: string;
      username: string;
      profilePicture: string | null;
      isEmailVerified: boolean;
      loginType: string;
      createdAt: string;
      updatedAt: string;
    };
    accessToken: string;
    refreshToken: string;
  }>>('/users/login', credentials);
  return data;
};

const registerUser = async (credentials: { email: string; username: string; password: string }) => {
  const { data } = await apiClient.post<ApiResponse<{
    user: {
      id: string;
      email: string;
      username: string;
      loginType: string;
      isEmailVerified: boolean;
      createdAt: string;
      updatedAt: string;
    };
  }>>('/users/register', credentials);
  return data;
};

const logoutUser = async () => {
  const { data } = await apiClient.post<ApiResponse>('/users/logout');
  return data;
};

const getCurrentUser = async () => {
  const { data } = await apiClient.get<ApiResponse<{
    userId: string;
    email: string;
    username: string;
  }>>('/users/current-user');
  return data;
};

const forgotPassword = async (email: string) => {
  const { data } = await apiClient.post<ApiResponse>('/users/forgot-password', { email });
  return data;
};

const resetPassword = async ({ token, newPassword }: { token: string; newPassword: string }) => {
  const { data } = await apiClient.post<ApiResponse>(`/users/reset-password/${token}`, { newPassword });
  return data;
};

const changePassword = async ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) => {
  const { data } = await apiClient.post<ApiResponse>('/users/change-password', { oldPassword, newPassword });
  return data;
};

const resendVerification = async () => {
  const { data } = await apiClient.post<ApiResponse>('/users/resend-email-verification');
  return data;
};

// Hooks
export function useLogin() {
  const { login } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      if (response.success) {
        login(response.data.user, {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        });
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        toast.success(response.message);
        router.push('/todos');
      }
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message);
      }
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: (response) => {
      if (response.success) {
        logout();
        queryClient.clear();
        toast.success(response.message);
      }
    },
    onError: (error) => {
      toast.error(handleApiError(error));
      logout();
      queryClient.clear();
    },
  });
}

export function useCurrentUser() {
  const { setCurrentUser, setIsLoading } = useAuthStore();

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      setIsLoading(true);
      try {
        const response = await getCurrentUser();
        if (response.success) {
          setCurrentUser(response.data);
        }
        return response;
      } finally {
        setIsLoading(false);
      }
    },
    retry: false,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: resendVerification,
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}

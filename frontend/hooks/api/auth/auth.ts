import { api } from "@/lib/api";
import {
  ApiResponse,
  CurrentUser,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "@/types/users";

// Auth API Functions

export const loginUser = async (credential: LoginCredentials) => {
  const { data } = await api.post<
    ApiResponse<{
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
    }>
  >("/users/login", credential);
  return data;
};

export const registerUser = async (user: RegisterCredentials) => {
  const { data } = await api.post<ApiResponse<User>>("/users/register", user);
  return data;
};

export const logoutUser = async () => {
  const { data } = await api.post<ApiResponse>("/users/logout");
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get<ApiResponse<CurrentUser>>(
    "/users/current-user",
  );
  return data;
};

export const forgotPassword = async (email: string) => {
  const { data } = await api.post<ApiResponse>("/users/forgot-password", {
    email,
  });
  return data;
};

export const resetPassword = async (
  newPassword: string,
  resetToken: string,
) => {
  const { data } = await api.post<ApiResponse>(
    `/users/reset-password/${resetToken}`,
    { newPassword },
  );
  return data;
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string,
) => {
  const { data } = await api.post<ApiResponse>("/users/change-password", {
    oldPassword,
    newPassword,
  });
  return data;
};

export const resendVerification = async () => {
  const { data } = await api.post<ApiResponse>(
    "/users/resend-email-verification",
  );
  return data;
};

export const verifyEmail = async (verificationToken: string) => {
  const { data } = await api.get<ApiResponse>(
    `/users/verify-email/${verificationToken}`,
  );
  return data;
};

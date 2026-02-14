// API Response types
export interface ApiResponse<T = unknown> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

// User types
export interface User {
  id: string;
  email: string;
  username: string;
  loginType: string;
  profilePicture?: string | null;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CurrentUser {
  userId: string;
  email: string;
  username: string;
}

// Todo types
export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  userId: string;
  priority: Priority;
  categoryId?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TodoFilters {
  page?: number;
  limit?: number;
  search?: string;
  completed?: boolean | null;
  priority?: Priority | null;
}

export interface PaginatedTodos {
  data: Todo[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Category types
export interface Category {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

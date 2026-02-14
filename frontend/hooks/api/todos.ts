'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiError } from '@/lib/api';
import { ApiResponse, Todo, PaginatedTodos, TodoFilters, Category } from '@/types/models';
import { toast } from 'sonner';

// API functions
const getTodos = async (filters: TodoFilters): Promise<ApiResponse<PaginatedTodos>> => {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.completed !== undefined && filters.completed !== null) params.append('completed', filters.completed.toString());
  if (filters.priority) params.append('priority', filters.priority);

  const { data } = await apiClient.get<ApiResponse<PaginatedTodos>>(`/todos?${params.toString()}`);
  return data;
};

const getTodoById = async (id: string): Promise<ApiResponse<Todo>> => {
  const { data } = await apiClient.get<ApiResponse<Todo>>(`/todos/${id}`);
  return data;
};

const createTodo = async (todo: {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  categoryId?: string;
}): Promise<ApiResponse<Todo>> => {
  const { data } = await apiClient.post<ApiResponse<Todo>>('/todos', todo);
  return data;
};

const updateTodo = async ({
  id,
  updates,
}: {
  id: string;
  updates: Partial<Todo>;
}): Promise<ApiResponse<Todo>> => {
  const { data } = await apiClient.put<ApiResponse<Todo>>(`/todos/${id}`, updates);
  return data;
};

const deleteTodo = async (id: string): Promise<ApiResponse<Todo>> => {
  const { data } = await apiClient.delete<ApiResponse<Todo>>(`/todos/${id}`);
  return data;
};

// Category API functions
const getCategories = async (): Promise<ApiResponse<Category[]>> => {
  // Note: Your API docs don't mention category endpoints, adjust as needed
  const { data } = await apiClient.get<ApiResponse<Category[]>>('/categories');
  return data;
};

const createCategory = async (category: { name: string; color: string }): Promise<ApiResponse<Category>> => {
  const { data } = await apiClient.post<ApiResponse<Category>>('/categories', category);
  return data;
};

// Hooks
export function useTodos(filters: TodoFilters) {
  return useQuery({
    queryKey: ['todos', filters],
    queryFn: () => getTodos(filters),
    placeholderData: (previousData) => previousData,
  });
}

export function useTodo(id: string) {
  return useQuery({
    queryKey: ['todo', id],
    queryFn: () => getTodoById(id),
    enabled: !!id,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['todos'] });
        toast.success(response.message);
      }
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodo,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['todos'] });
        queryClient.invalidateQueries({ queryKey: ['todo', response.data.id] });
        toast.success(response.message);
      }
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['todos'] });
        toast.success(response.message);
      }
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}

export function useToggleTodoCompletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isCompleted }: { id: string; isCompleted: boolean }) => {
      const { data } = await apiClient.put<ApiResponse<Todo>>(`/todos/${id}`, { isCompleted });
      return data;
    },
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['todos'] });
        queryClient.invalidateQueries({ queryKey: ['todo', response.data.id] });
        toast.success(response.data.isCompleted ? 'Todo completed!' : 'Todo marked as incomplete');
      }
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}

// Category hooks
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        toast.success(response.message);
      }
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}

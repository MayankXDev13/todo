import { api } from "@/lib/api";
import {
  CreateTodoPayload,
  UpdateTodoPayload,
  GetTodosParams,
  Todo,
  PaginatedResponse,
} from "@/types/todo";
import { ApiResponse } from "@/types/users";

export const createTodo = async (
  payload: CreateTodoPayload,
): Promise<ApiResponse<Todo>> => {
  const { data } = await api.post<ApiResponse<Todo>>("/todos", payload);
  return data;
};

export const getAllTodos = async (
  params?: GetTodosParams,
): Promise<ApiResponse<PaginatedResponse<Todo>>> => {
  const { data } = await api.get<ApiResponse<PaginatedResponse<Todo>>>(
    "/todos",
    { params },
  );
  return data;
};

export const getTodoById = async (id: string): Promise<ApiResponse<Todo>> => {
  const { data } = await api.get<ApiResponse<Todo>>(`/todos/${id}`);
  return data;
};

export const updateTodo = async (
  id: string,
  payload: UpdateTodoPayload,
): Promise<ApiResponse<Todo>> => {
  const { data } = await api.put<ApiResponse<Todo>>(`/todos/${id}`, payload);
  return data;
};

export const toggleTodo = async (id: string): Promise<ApiResponse<Todo>> => {
  const { data } = await api.patch<ApiResponse<Todo>>(`/todos/${id}/toggle`);
  return data;
};

export const deleteTodo = async (id: string): Promise<ApiResponse<Todo>> => {
  const { data } = await api.delete<ApiResponse<Todo>>(`/todos/${id}`);
  return data;
};

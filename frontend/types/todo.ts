export type Priority = "low" | "medium" | "high";

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  userId: string;
  priority: Priority;
  categoryId: string | null;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoPayload {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: Priority;
  categoryId?: string;
}


export interface UpdateTodoPayload {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: Priority;
  categoryId?: string;
  isCompleted?: boolean;
}

export interface GetTodosParams {
  page?: number;
  limit?: number;
  search?: string;
  completed?: boolean;
  priority?: Priority;
  sortBy?: "createdAt" | "dueDate" | "priority";
  sortOrder?: "asc" | "desc";
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
import { and, desc, eq, ilike, sql, SQL } from "drizzle-orm";
import { db } from "../db/db";
import { Todo } from "../schema";
import { asyncHandler } from "../utils/asyncHandler";
import { getPagination } from "../utils/pagination";

type TodoRow = typeof Todo.$inferSelect;

interface GetTodosOptions {
  page?: number;
  limit?: number;
  search?: string;
  userId?: string;
  completed?: boolean;
  priority: "low" | "medium" | "high";
}

interface GetTodosResponse {
  data: TodoRow[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const getTodosService = async ({
  page,
  limit,
  search,
  userId,
  completed,
  priority,
}: GetTodosOptions): Promise<GetTodosResponse> => {
  const { offset, perPage, currentPage } = getPagination(page, limit);

  const filters: SQL[] = [];

  if (userId) {
    filters.push(eq(Todo.userId, userId));
  }

  if (completed) {
    filters.push(eq(Todo.isCompleted, completed));
  }

  if (priority) {
    filters.push(eq(Todo.priority, priority));
  }

  const searchQuery = search?.trim();
  if (searchQuery && searchQuery.length > 0) {
    filters.push(ilike(Todo.title, `%${searchQuery}%`));
  }

  const whereClause = filters.length > 0 ? and(...filters) : undefined;

  const [todos, countResult] = await Promise.all([
    db
      .select()
      .from(Todo)
      .where(whereClause)
      .orderBy(desc(Todo.createdAt))
      .limit(perPage)
      .offset(offset),
    db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(Todo)
      .where(whereClause),
  ]);

  const total = countResult[0]?.count ?? 0;
  const totalPages = Math.ceil(total / perPage);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  return {
    data: todos,
    meta: {
      page: currentPage,
      limit: perPage,
      total,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    },
  };
};

export const getTodoByIdService = async (
  id: string,
  userId: string,
): Promise<TodoRow | null> => {
  const todo = await db
    .select()
    .from(Todo)
    .where(and(eq(Todo.id, id), eq(Todo.userId, userId)))
    .limit(1);

  return todo[0] ?? null;
};


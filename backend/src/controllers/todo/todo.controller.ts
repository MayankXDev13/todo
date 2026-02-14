import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";
import { Todo } from "../../schema";
import { db } from "../../db/db";
import { ApiResponse } from "../../utils/ApiResponse";
import { and, desc, eq, ilike, sql, SQL } from "drizzle-orm";
import { getPagination } from "../../utils/pagination";

export const createTodo = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, dueDate, priority, categoryId } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const todo = await db
    .insert(Todo)
    .values({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority,
      categoryId,
      userId,
    })
    .returning();

  if (!todo || todo.length === 0) {
    throw new ApiError(500, "Failed to create todo");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, todo[0], "Todo created successfully"));
});

export const getTodos = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { page, limit, search, completed, priority } = req.query as {
    page?: string;
    limit?: string;
    search?: string;
    completed?: string;
    priority?: "low" | "medium" | "high";
  };

  const pageNum = page ? parseInt(page) : 1;
  const limitNum = limit ? parseInt(limit) : 10;
  const completedBool = completed === "true" ? true : completed === "false" ? false : undefined;

  const { offset, perPage, currentPage } = getPagination(pageNum, limitNum);

  const filters: SQL[] = [];
  filters.push(eq(Todo.userId, userId));

  if (completedBool !== undefined) {
    filters.push(eq(Todo.isCompleted, completedBool));
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

  return res
    .status(200)
    .json(new ApiResponse(200, {
      data: todos,
      meta: {
        page: currentPage,
        limit: perPage,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    }, "Todos fetched successfully"));
});

export const getTodoById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { id } = req.params;

  const todo = await db.query.Todo.findFirst({
    where: and(eq(Todo.id, id), eq(Todo.userId, userId)),
  });

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, todo, "Todo fetched successfully"));
});

export const updateTodo = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;
  const { title, description, dueDate, priority, categoryId } = req.body;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const updateData: Record<string, any> = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (dueDate !== undefined) updateData.dueDate = new Date(dueDate);
  if (priority !== undefined) updateData.priority = priority;
  if (categoryId !== undefined) updateData.categoryId = categoryId;

  const updated = await db
    .update(Todo)
    .set({
      ...updateData,
      updatedAt: new Date(),
    })
    .where(and(eq(Todo.id, id), eq(Todo.userId, userId)))
    .returning();

  if (!updated.length) {
    throw new ApiError(404, "Todo not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updated[0], "Todo updated successfully"));
});

export const deleteTodo = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const deleted = await db
    .delete(Todo)
    .where(and(eq(Todo.id, id), eq(Todo.userId, userId)))
    .returning();

  if (!deleted.length) {
    throw new ApiError(404, "Todo not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deleted[0], "Todo deleted successfully"));
});

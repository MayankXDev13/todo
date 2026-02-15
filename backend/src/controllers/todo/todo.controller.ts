import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";
import { Category, Todo } from "../../schema";
import { db } from "../../db/db";
import { z } from "zod";
import { ApiResponse } from "../../utils/ApiResponse";
import { and, asc, desc, eq, ilike, sql, SQL } from "drizzle-orm";
import { getPagination } from "../../utils/pagination";

// ─── Shared Schemas ───────────────────────────────────────────────────────────

const uuidSchema = z.string().uuid("Invalid todo ID");

const TodoBaseSchema = z.object({
  title: z.string().min(1, "Title is required").max(255).trim(),
  description: z.string().max(1000).trim().optional(),
  dueDate: z.coerce.date().optional().nullable(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  categoryId: z.string().uuid("Invalid category ID").optional(),
});

const CreateTodoSchema = TodoBaseSchema;

const UpdateTodoSchema = TodoBaseSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "No fields to update" }
);

const GetTodosQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  search: z.string().max(255).optional(),
  completed: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  sortBy: z.enum(["createdAt", "dueDate", "priority"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

// ─── Helper ───────────────────────────────────────────────────────────────────

async function assertCategoryOwnership(categoryId: string, userId: string) {
  const category = await db
    .select()
    .from(Category)
    .where(and(eq(Category.id, categoryId), eq(Category.userId, userId)))
    .limit(1);

  if (!category.length) {
    throw new ApiError(404, "Category not found");
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

type TodoRow = typeof Todo.$inferSelect;

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

// ─── Handlers ─────────────────────────────────────────────────────────────────

export const createTodo = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const parsed = CreateTodoSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0].message);
  }

  const { title, description, dueDate, priority, categoryId } = parsed.data;

  // Verify category ownership before associating
  if (categoryId) {
    await assertCategoryOwnership(categoryId, userId);
  }

  const [todo] = await db
    .insert(Todo)
    .values({
      title,
      description,
      dueDate: dueDate ?? undefined,
      priority,
      categoryId,
      userId,
    })
    .returning();

  if (!todo) throw new ApiError(500, "Failed to create todo");

  return res
    .status(201)
    .json(new ApiResponse(201, todo, "Todo created successfully"));
});

export const getTodos = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const validationResult = GetTodosQuerySchema.safeParse(req.query);
  if (!validationResult.success) {
    throw new ApiError(400, "Invalid query parameters", [
      validationResult.error.flatten().fieldErrors,
    ]);
  }

  const { page, limit, search, completed, priority, sortBy, sortOrder } =
    validationResult.data;

  const { offset, perPage, currentPage } = getPagination(page, limit);

  const filters: SQL[] = [eq(Todo.userId, userId)];

  if (completed !== undefined) filters.push(eq(Todo.isCompleted, completed));
  if (priority) filters.push(eq(Todo.priority, priority));

  const searchQuery = search?.trim();
  if (searchQuery) filters.push(ilike(Todo.title, `%${searchQuery}%`));

  const whereClause = and(...filters);

  // Dynamic sort column
  const sortColumn =
    sortBy === "dueDate"
      ? Todo.dueDate
      : sortBy === "priority"
      ? Todo.priority
      : Todo.createdAt;

  const orderClause = sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn);

  const [todos, countResult] = await Promise.all([
    db
      .select()
      .from(Todo)
      .where(whereClause)
      .orderBy(orderClause)
      .limit(perPage)
      .offset(offset),
    db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(Todo)
      .where(whereClause),
  ]);

  const total = countResult[0]?.count ?? 0;
  const totalPages = Math.ceil(total / perPage);

  const result: GetTodosResponse = {
    data: todos,
    meta: {
      page: currentPage,
      limit: perPage,
      total,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  };

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Todos fetched successfully"));
});

export const getTodoById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const idParsed = uuidSchema.safeParse(req.params.id);
  if (!idParsed.success) throw new ApiError(400, "Invalid todo ID");

  const todo = await db.query.Todo.findFirst({
    where: and(eq(Todo.id, idParsed.data), eq(Todo.userId, userId)),
  });

  if (!todo) throw new ApiError(404, "Todo not found");

  return res
    .status(200)
    .json(new ApiResponse(200, todo, "Todo fetched successfully"));
});

export const updateTodo = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const idParsed = uuidSchema.safeParse(req.params.id);
  if (!idParsed.success) throw new ApiError(400, "Invalid todo ID");

  const parsed = UpdateTodoSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0].message);
  }

  const updateData = parsed.data;

  if (updateData.categoryId) {
    await assertCategoryOwnership(updateData.categoryId, userId);
  }

  const updated = await db
    .update(Todo)
    .set({
      ...updateData,
      // Allow explicit null to clear dueDate
      ...(updateData.dueDate !== undefined && { dueDate: updateData.dueDate }),
      updatedAt: new Date(),
    })
    .where(and(eq(Todo.id, idParsed.data), eq(Todo.userId, userId)))
    .returning();

  if (!updated.length) throw new ApiError(404, "Todo not found");

  return res
    .status(200)
    .json(new ApiResponse(200, updated[0], "Todo updated successfully"));
});

export const toggleTodo = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const idParsed = uuidSchema.safeParse(req.params.id);
  if (!idParsed.success) throw new ApiError(400, "Invalid todo ID");

  const todo = await db.query.Todo.findFirst({
    where: and(eq(Todo.id, idParsed.data), eq(Todo.userId, userId)),
  });

  if (!todo) throw new ApiError(404, "Todo not found");

  const [updated] = await db
    .update(Todo)
    .set({ isCompleted: !todo.isCompleted, updatedAt: new Date() })
    .where(and(eq(Todo.id, idParsed.data), eq(Todo.userId, userId)))
    .returning();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updated,
        `Todo marked as ${updated.isCompleted ? "completed" : "incomplete"}`
      )
    );
});

export const deleteTodo = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const idParsed = uuidSchema.safeParse(req.params.id);
  if (!idParsed.success) throw new ApiError(400, "Invalid todo ID");

  const deleted = await db
    .delete(Todo)
    .where(and(eq(Todo.id, idParsed.data), eq(Todo.userId, userId)))
    .returning();

  if (!deleted.length) throw new ApiError(404, "Todo not found");

  return res
    .status(200)
    .json(new ApiResponse(200, deleted[0], "Todo deleted successfully"));
});
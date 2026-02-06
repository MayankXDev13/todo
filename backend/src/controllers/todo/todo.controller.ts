import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";
import { Todo } from "../../schema";
import { db } from "../../db/db";
import { z } from "zod";
import { ApiResponse } from "../../utils/ApiResponse";
import {
  getTodosService,
  getTodoByIdService,
} from "../../services/todo.service";

export const createTodo = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, dueDate, priority, categoryId } = req.body;

  if (!req.user?.id) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  const todo = await db
    .insert(Todo)
    .values({
      title,
      description,
      dueDate,
      priority,
      categoryId,
      userId: req.user.id,
    })
    .returning();

  if (!todo || todo.length === 0) {
    throw new ApiError(500, "Failed to create todo");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, todo[0], "Todo created successfully"));
});

const GetTodosQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  search: z.string().max(255).optional(),
  userId: z.string().optional(),
  completed: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

type GetTodosQuery = z.infer<typeof GetTodosQuerySchema>;

export const getTodos = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const validationResult = GetTodosQuerySchema.safeParse(req.query);

  if (!validationResult.success) {
    throw new ApiError(400, "Invalid query parameters", [
      validationResult.error.flatten().fieldErrors,
    ]);
  }

  const { page, limit, search, completed, priority } = validationResult.data;

  const result = await getTodosService({
    page,
    limit,
    search,
    completed,
    userId,
    priority: priority || "low",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Todos fetched successfully"));
});

export const getTodoById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { id } = req.params;

  // Validate ID format
  if (!id || typeof id !== "string") {
    throw new ApiError(400, "Invalid todo ID");
  }

  const todo = await getTodoByIdService(id, userId);

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, todo, "Todo fetched successfully"));
});

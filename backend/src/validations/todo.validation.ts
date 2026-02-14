import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(256, "Title too long"),
  description: z.string().max(256, "Description too long").optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  categoryId: z.string().uuid().optional(),
});

export const updateTodoSchema = createTodoSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update" }
);

export const todoIdSchema = z.object({
  id: z.string().uuid("Invalid todo ID"),
});

export const getTodosQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  search: z.string().max(255).optional(),
  completed: z.enum(["true", "false"]).transform((val) => val === "true").optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

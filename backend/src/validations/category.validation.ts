import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(256, "Name too long"),
});

export const updateCategorySchema = createCategorySchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update" }
);

export const categoryIdSchema = z.object({
  id: z.string().uuid("Invalid category ID"),
});

export const getCategoriesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  search: z.string().max(255).optional(),
});

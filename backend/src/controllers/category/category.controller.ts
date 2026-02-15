import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";
import { Category } from "../../schema";
import { db } from "../../db/db";
import { z } from "zod";
import { ApiResponse } from "../../utils/ApiResponse";
import { and, asc, desc, eq, ilike, sql, SQL } from "drizzle-orm";
import { getPagination } from "../../utils/pagination";

// ─── Shared Schemas ───────────────────────────────────────────────────────────

const uuidSchema = z.string().uuid("Invalid category ID");

const CategoryBaseSchema = z.object({
  name: z.string().min(1, "Name is required").max(256).trim(),
});

const CreateCategorySchema = CategoryBaseSchema;

const UpdateCategorySchema = CategoryBaseSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "No fields to update" }
);

const GetCategoriesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  search: z.string().max(255).optional(),
  sortBy: z.enum(["createdAt", "name"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

// ─── Types ────────────────────────────────────────────────────────────────────

type CategoryRow = typeof Category.$inferSelect;

interface GetCategoriesResponse {
  data: CategoryRow[];
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

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const parsed = CreateCategorySchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0].message);
  }

  const { name } = parsed.data;

  // Check for duplicate category name for this user
  const existingCategory = await db
    .select()
    .from(Category)
    .where(and(eq(Category.name, name), eq(Category.userId, userId)))
    .limit(1);

  if (existingCategory.length) {
    throw new ApiError(409, "Category with this name already exists");
  }

  const [category] = await db
    .insert(Category)
    .values({
      name,
      userId,
    })
    .returning();

  if (!category) throw new ApiError(500, "Failed to create category");

  return res
    .status(201)
    .json(new ApiResponse(201, category, "Category created successfully"));
});

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const validationResult = GetCategoriesQuerySchema.safeParse(req.query);
  if (!validationResult.success) {
    throw new ApiError(400, "Invalid query parameters", [
      validationResult.error.flatten().fieldErrors,
    ]);
  }

  const { page, limit, search, sortBy, sortOrder } = validationResult.data;

  const { offset, perPage, currentPage } = getPagination(page, limit);

  const filters: SQL[] = [eq(Category.userId, userId)];

  const searchQuery = search?.trim();
  if (searchQuery) filters.push(ilike(Category.name, `%${searchQuery}%`));

  const whereClause = and(...filters);

  // Dynamic sort column
  const sortColumn = sortBy === "name" ? Category.name : Category.createdAt;

  const orderClause = sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn);

  const [categories, countResult] = await Promise.all([
    db
      .select()
      .from(Category)
      .where(whereClause)
      .orderBy(orderClause)
      .limit(perPage)
      .offset(offset),
    db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(Category)
      .where(whereClause),
  ]);

  const total = countResult[0]?.count ?? 0;
  const totalPages = Math.ceil(total / perPage);

  const result: GetCategoriesResponse = {
    data: categories,
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
    .json(new ApiResponse(200, result, "Categories fetched successfully"));
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const idParsed = uuidSchema.safeParse(req.params.id);
  if (!idParsed.success) throw new ApiError(400, "Invalid category ID");

  const category = await db.query.Category.findFirst({
    where: and(eq(Category.id, idParsed.data), eq(Category.userId, userId)),
  });

  if (!category) throw new ApiError(404, "Category not found");

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category fetched successfully"));
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const idParsed = uuidSchema.safeParse(req.params.id);
  if (!idParsed.success) throw new ApiError(400, "Invalid category ID");

  const parsed = UpdateCategorySchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0].message);
  }

  const updateData = parsed.data;

  // Check for duplicate name if updating name
  if (updateData.name) {
    const existingCategory = await db
      .select()
      .from(Category)
      .where(
        and(
          eq(Category.name, updateData.name),
          eq(Category.userId, userId)
        )
      )
      .limit(1);

    if (existingCategory.length && existingCategory[0].id !== idParsed.data) {
      throw new ApiError(409, "Category with this name already exists");
    }
  }

  const updated = await db
    .update(Category)
    .set({
      ...updateData,
      updatedAt: new Date(),
    })
    .where(and(eq(Category.id, idParsed.data), eq(Category.userId, userId)))
    .returning();

  if (!updated.length) throw new ApiError(404, "Category not found");

  return res
    .status(200)
    .json(new ApiResponse(200, updated[0], "Category updated successfully"));
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const idParsed = uuidSchema.safeParse(req.params.id);
  if (!idParsed.success) throw new ApiError(400, "Invalid category ID");

  const deleted = await db
    .delete(Category)
    .where(and(eq(Category.id, idParsed.data), eq(Category.userId, userId)))
    .returning();

  if (!deleted.length) throw new ApiError(404, "Category not found");

  return res
    .status(200)
    .json(new ApiResponse(200, deleted[0], "Category deleted successfully"));
});

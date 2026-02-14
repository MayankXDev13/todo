import { z } from 'zod';

export const priorityEnum = z.enum(['low', 'medium', 'high']);

// Create todo schema
export const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(256, 'Title must be less than 256 characters'),
  description: z.string().max(256, 'Description must be less than 256 characters').optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  categoryId: z.string().uuid().optional(),
});

export type CreateTodoSchema = {
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  categoryId?: string;
};

// Update todo schema (all fields optional)
export const updateTodoSchema = z.object({
  title: z.string().min(1).max(256).optional(),
  description: z.string().max(256).optional(),
  dueDate: z.string().datetime().optional(),
  priority: priorityEnum.optional(),
  categoryId: z.string().uuid().optional(),
  isCompleted: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

export type UpdateTodoSchema = z.infer<typeof updateTodoSchema>;

// Todo filters schema
export const todoFiltersSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  completed: z.boolean().optional(),
  priority: priorityEnum.optional(),
});

export type TodoFiltersSchema = z.infer<typeof todoFiltersSchema>;

// Category schema
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color'),
});

export type CreateCategorySchema = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z.object({
  name: z.string().min(1).max(50).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;

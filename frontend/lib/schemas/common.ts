import { z } from 'zod';

// UUID validation
export const uuidSchema = z.string().uuid('Invalid UUID format');

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export type PaginationSchema = z.infer<typeof paginationSchema>;

import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(255),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(255)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Slug can only contain letters, numbers, dashes, and underscores'
    ),
  parent_id: z.number().nullable().optional(),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  status: z.enum(['active', 'inactive']),
  sort_order: z.number().min(0).default(0),
});

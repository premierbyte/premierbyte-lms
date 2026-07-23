import { z } from 'zod';

export const courseSchema = z.object({
  title: z.string().min(2, 'Course title must be at least 2 characters').max(255),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(255),
  category_id: z.coerce.number().min(1, 'Please select a category'),
  subtitle: z.string().max(255).optional().nullable(),
  description: z.string().optional().nullable(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'all_levels']).default('all_levels'),
  language: z.string().default('en'),
  price: z.coerce.number().min(0, 'Price must be non-negative').default(0),
  compare_at_price: z.coerce.number().min(0).optional().nullable(),
  is_free: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  thumbnail: z.string().url('Must be a valid URL').optional().or(z.literal('')).nullable(),
  banner: z.string().url('Must be a valid URL').optional().or(z.literal('')).nullable(),
  meta_title: z.string().max(255).optional().nullable(),
  meta_description: z.string().optional().nullable(),
  meta_keywords: z.string().max(255).optional().nullable(),
});

export type CourseFormValues = z.infer<typeof courseSchema>;

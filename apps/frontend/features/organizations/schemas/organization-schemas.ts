import { z } from 'zod';

export const organizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required').max(255),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(255)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Slug can only contain letters, numbers, dashes, and underscores'
    ),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  timezone: z.string().min(1, 'Timezone is required'),
  locale: z.string().min(1, 'Locale is required'),
  logo: z.string().nullable().optional(),
  favicon: z.string().nullable().optional(),
  primary_color: z
    .string()
    .regex(
      /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,
      'Primary color must be a valid hex code (e.g. #4f46e5)'
    ),
  secondary_color: z
    .string()
    .regex(
      /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,
      'Secondary color must be a valid hex code (e.g. #9333ea)'
    ),
  status: z.enum(['active', 'inactive', 'suspended']),
});

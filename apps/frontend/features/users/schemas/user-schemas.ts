import { z } from 'zod';

export const createUserSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(255),
  last_name: z.string().min(1, 'Last name is required').max(255),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(255)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, dashes, and underscores'
    ),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().nullable().optional(),
  password: z
    .string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
  avatar: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  status: z.enum(['active', 'pending', 'suspended']),
  roles: z.array(z.string()).min(1, 'Select at least one role'),
});

export const updateUserSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(255),
  last_name: z.string().min(1, 'Last name is required').max(255),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(255)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, dashes, and underscores'
    ),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().nullable().optional(),
  password: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        (val.length >= 12 &&
          /[A-Z]/.test(val) &&
          /[a-z]/.test(val) &&
          /[0-9]/.test(val) &&
          /[^A-Za-z0-9]/.test(val)),
      'Password must be at least 12 characters and contain uppercase, lowercase, numbers, and special characters'
    ),
  avatar: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  status: z.enum(['active', 'pending', 'suspended']),
  roles: z.array(z.string()).min(1, 'Select at least one role'),
});

export const inviteUserSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  role: z.string().min(1, 'Role is required'),
});

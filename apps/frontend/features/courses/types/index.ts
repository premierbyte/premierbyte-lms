import { Category } from '@/features/categories/types';
import { User } from '@/features/users/types';

export interface Course {
  id: number;
  category_id: number;
  instructor_id: number;
  title: string;
  slug: string;
  subtitle?: string | null;
  description?: string | null;
  status: 'draft' | 'published' | 'archived';
  level: 'beginner' | 'intermediate' | 'advanced' | 'all_levels';
  language: string;
  price: number;
  compare_at_price?: number | null;
  is_free: boolean;
  is_featured: boolean;
  thumbnail?: string | null;
  banner?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  published_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  category?: Category;
  instructor?: User;
}

export interface CourseFilters {
  search?: string;
  category_id?: number;
  status?: string;
  level?: string;
  is_featured?: boolean;
  page?: number;
  per_page?: number;
}

export interface CoursesResponse {
  success: boolean;
  message: string;
  data: Course[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface CreateCourseData {
  category_id: number;
  instructor_id?: number;
  title: string;
  slug: string;
  subtitle?: string | null;
  description?: string | null;
  status?: 'draft' | 'published' | 'archived';
  level?: 'beginner' | 'intermediate' | 'advanced' | 'all_levels';
  language?: string;
  price?: number;
  compare_at_price?: number | null;
  is_free?: boolean;
  is_featured?: boolean;
  thumbnail?: string | null;
  banner?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
}

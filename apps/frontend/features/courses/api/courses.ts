import apiClient from '@/lib/api-client';
import {
  Course,
  CourseFilters,
  CoursesResponse,
  CreateCourseData,
} from '../types';

export const coursesApi = {
  getCourses: async (filters: CourseFilters = {}): Promise<CoursesResponse> => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category_id)
      params.append('category_id', filters.category_id.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.level) params.append('level', filters.level);
    if (filters.is_featured !== undefined)
      params.append('is_featured', filters.is_featured ? '1' : '0');
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page)
      params.append('per_page', filters.per_page.toString());

    const response = await apiClient.get<CoursesResponse>(
      `/api/v1/courses?${params.toString()}`
    );
    return response.data;
  },

  getCourse: async (id: number): Promise<Course> => {
    const response = await apiClient.get<{ success: boolean; data: Course }>(
      `/api/v1/courses/${id}`
    );
    return response.data.data;
  },

  createCourse: async (data: CreateCourseData) => {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: Course;
    }>('/api/v1/courses', data);
    return response.data;
  },

  updateCourse: async (id: number, data: Partial<CreateCourseData>) => {
    const response = await apiClient.put<{
      success: boolean;
      message: string;
      data: Course;
    }>(`/api/v1/courses/${id}`, data);
    return response.data;
  },

  publishCourse: async (
    id: number,
    status: 'draft' | 'published' | 'archived'
  ) => {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: Course;
    }>(`/api/v1/courses/${id}/publish`, { status });
    return response.data;
  },

  deleteCourse: async (id: number) => {
    const response = await apiClient.delete<{
      success: boolean;
      message: string;
    }>(`/api/v1/courses/${id}`);
    return response.data;
  },
};

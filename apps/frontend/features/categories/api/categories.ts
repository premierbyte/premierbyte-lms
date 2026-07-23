import apiClient from '@/lib/api-client';
import { Category, CreateCategoryData, ReorderCategoryItem } from '../types';

export const categoriesApi = {
  getCategories: async (mode: 'tree' | 'flat' = 'tree', search?: string) => {
    const params = new URLSearchParams({ mode });
    if (search) params.append('search', search);

    const response = await apiClient.get<{
      success: boolean;
      data: Category[];
    }>(`/api/v1/categories?${params.toString()}`);
    return response.data.data;
  },

  getCategory: async (id: number) => {
    const response = await apiClient.get<{ success: boolean; data: Category }>(
      `/api/v1/categories/${id}`
    );
    return response.data.data;
  },

  createCategory: async (data: CreateCategoryData) => {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: Category;
    }>('/api/v1/categories', data);
    return response.data;
  },

  updateCategory: async (id: number, data: CreateCategoryData) => {
    const response = await apiClient.put<{
      success: boolean;
      message: string;
      data: Category;
    }>(`/api/v1/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: number) => {
    const response = await apiClient.delete<{
      success: boolean;
      message: string;
    }>(`/api/v1/categories/${id}`);
    return response.data;
  },

  reorderCategories: async (items: ReorderCategoryItem[]) => {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>('/api/v1/categories/reorder', { items });
    return response.data;
  },
};

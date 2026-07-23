import apiClient from '@/lib/api-client';
import {
  CreateUserData,
  InviteUserData,
  User,
  UserFilters,
  UsersResponse,
} from '../types';

export const usersApi = {
  getUsers: async (filters: UserFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.role) params.append('role', filters.role);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page)
      params.append('per_page', filters.per_page.toString());

    const response = await apiClient.get<UsersResponse>(
      `/api/v1/users?${params.toString()}`
    );
    return response.data;
  },

  getUser: async (id: number) => {
    const response = await apiClient.get<{ success: boolean; data: User }>(
      `/api/v1/users/${id}`
    );
    return response.data.data;
  },

  createUser: async (data: CreateUserData) => {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: User;
    }>('/api/v1/users', data);
    return response.data;
  },

  updateUser: async (id: number, data: Partial<CreateUserData>) => {
    const response = await apiClient.put<{
      success: boolean;
      message: string;
      data: User;
    }>(`/api/v1/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number) => {
    const response = await apiClient.delete<{
      success: boolean;
      message: string;
    }>(`/api/v1/users/${id}`);
    return response.data;
  },

  inviteUser: async (data: InviteUserData) => {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: User;
    }>('/api/v1/users/invite', data);
    return response.data;
  },
};

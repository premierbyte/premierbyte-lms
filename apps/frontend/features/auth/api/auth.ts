import apiClient from '@/lib/api-client';
import {
  LoginCredentials,
  RegisterData,
  ResetPasswordData,
  User,
} from '../types';

export const authApi = {
  getCsrfCookie: async () => {
    return apiClient.get('/sanctum/csrf-cookie');
  },

  login: async (credentials: LoginCredentials) => {
    return apiClient.post('/api/v1/login', credentials);
  },

  register: async (data: RegisterData) => {
    return apiClient.post('/api/v1/register', data);
  },

  logout: async () => {
    return apiClient.post('/api/v1/logout');
  },

  getMe: async () => {
    const response = await apiClient.get<{ success: boolean; data: User }>(
      '/api/v1/auth/me'
    );
    return response.data.data;
  },

  forgotPassword: async (email: string) => {
    return apiClient.post('/api/v1/forgot-password', { email });
  },

  resetPassword: async (data: ResetPasswordData) => {
    return apiClient.post('/api/v1/reset-password', data);
  },
};

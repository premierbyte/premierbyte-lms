import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/use-auth-store';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
  withXSRFToken: true,
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token =
        localStorage.getItem('auth_token') || useAuthStore.getState().user;
      if (token && typeof token === 'string') {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const isAuthPage =
          window.location.pathname === '/login' ||
          window.location.pathname === '/register';
        if (!isAuthPage) {
          useAuthStore.getState().clearAuth();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/use-auth-store';
import { LoginCredentials, RegisterData, ResetPasswordData } from '../types';

export function useAuth() {
  const queryClient = useQueryClient();
  const {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    setIsLoading,
    logout: clearStore,
  } = useAuthStore();

  const {
    data: fetchedUser,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['auth-user'],
    queryFn: authApi.getMe,
    retry: false,
    enabled: false, // We'll trigger it manually on mount or login
  });

  // Load user profile on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const profile = await queryClient.fetchQuery({
          queryKey: ['auth-user'],
          queryFn: authApi.getMe,
        });
        setUser(profile);
      } catch (err) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, [setUser, setIsLoading, queryClient]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      await authApi.getCsrfCookie();
      await authApi.login(credentials);
      return authApi.getMe();
    },
    onSuccess: (data) => {
      setUser(data);
      queryClient.setQueryData(['auth-user'], data);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      await authApi.getCsrfCookie();
      await authApi.register(data);
      return authApi.getMe();
    },
    onSuccess: (data) => {
      setUser(data);
      queryClient.setQueryData(['auth-user'], data);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearStore();
      queryClient.setQueryData(['auth-user'], null);
      queryClient.clear();
    },
  });

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.roles.includes(role) || user.roles.includes('Super Admin');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return (
      user.permissions.includes(permission) ||
      user.roles.includes('Super Admin')
    );
  };

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || isFetching,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
    refetchUser: refetch,
    hasRole,
    hasPermission,
  };
}

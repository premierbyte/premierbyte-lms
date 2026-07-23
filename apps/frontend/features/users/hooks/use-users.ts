import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users';
import { CreateUserData, InviteUserData, UserFilters } from '../types';

export function useUsers(filters: UserFilters = {}) {
  const queryClient = useQueryClient();

  const {
    data: usersResponse,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['users-list', filters],
    queryFn: () => usersApi.getUsers(filters),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateUserData) => usersApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-list'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateUserData> }) =>
      usersApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-list'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => usersApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-list'] });
    },
  });

  const inviteMutation = useMutation({
    mutationFn: (data: InviteUserData) => usersApi.inviteUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-list'] });
    },
  });

  return {
    users: usersResponse?.data || [],
    meta: usersResponse?.meta,
    isLoading: isLoading || isFetching,
    error,
    createUser: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateUser: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteUser: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    inviteUser: inviteMutation.mutateAsync,
    isInviting: inviteMutation.isPending,
  };
}

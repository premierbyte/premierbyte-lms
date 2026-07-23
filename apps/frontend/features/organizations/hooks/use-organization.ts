import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationsApi } from '../api/organizations';
import { UpdateOrganizationData } from '../types';

export function useOrganization() {
  const queryClient = useQueryClient();

  const {
    data: organization,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['organization-details'],
    queryFn: organizationsApi.getOrganization,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateOrganizationData) =>
      organizationsApi.updateOrganization(data),
    onSuccess: (response) => {
      queryClient.setQueryData(['organization-details'], response.data);
    },
  });

  return {
    organization,
    isLoading,
    error,
    updateOrganization: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}

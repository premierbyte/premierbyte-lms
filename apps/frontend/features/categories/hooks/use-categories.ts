import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '../api/categories';
import { CreateCategoryData, ReorderCategoryItem } from '../types';

export function useCategories(mode: 'tree' | 'flat' = 'tree', search?: string) {
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['categories-list', mode, search],
    queryFn: () => categoriesApi.getCategories(mode, search),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryData) =>
      categoriesApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories-list'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateCategoryData }) =>
      categoriesApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories-list'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => categoriesApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories-list'] });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (items: ReorderCategoryItem[]) =>
      categoriesApi.reorderCategories(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories-list'] });
    },
  });

  return {
    categories,
    isLoading: isLoading || isFetching,
    error,
    createCategory: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateCategory: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteCategory: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    reorderCategories: reorderMutation.mutateAsync,
    isReordering: reorderMutation.isPending,
  };
}

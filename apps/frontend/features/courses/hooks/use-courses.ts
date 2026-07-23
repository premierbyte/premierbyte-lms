import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '../api/courses';
import { CourseFilters, CreateCourseData } from '../types';

export function useCourses(filters: CourseFilters = {}) {
  const queryClient = useQueryClient();

  const queryKey = ['courses', filters];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => coursesApi.getCourses(filters),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateCourseData) => coursesApi.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateCourseData>;
    }) => coursesApi.updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const publishMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: 'draft' | 'published' | 'archived';
    }) => coursesApi.publishCourse(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => coursesApi.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  return {
    courses: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    createCourse: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateCourse: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    publishCourse: publishMutation.mutateAsync,
    isPublishing: publishMutation.isPending,
    deleteCourse: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

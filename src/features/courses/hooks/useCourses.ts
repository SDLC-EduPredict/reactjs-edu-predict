import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/queryKeys';
import type { QueryParams } from '@/types';
import { adminCatalogApi, catalogApi } from '../api/coursesApi';
import type { CourseListParams } from '../types';

export const useCategories = () =>
  useQuery({
    queryKey: queryKeys.catalog.categories,
    queryFn: catalogApi.categories,
    staleTime: 5 * 60 * 1000,
    select: (result) => result.data.categories,
  });

export const useCourses = (params: CourseListParams) =>
  useQuery({
    queryKey: queryKeys.catalog.courses(params as QueryParams),
    queryFn: () => catalogApi.courses(params),
    placeholderData: keepPreviousData,
    select: (result) => result.data,
  });

export const useCourse = (idOrSlug: string | undefined) =>
  useQuery({
    queryKey: queryKeys.catalog.course(idOrSlug ?? ''),
    queryFn: () => catalogApi.course(idOrSlug ?? ''),
    enabled: Boolean(idOrSlug),
    select: (result) => result.data.course,
  });

export const useAdminCategories = () =>
  useQuery({
    queryKey: queryKeys.admin.categories,
    queryFn: adminCatalogApi.categories,
    select: (result) => result.data.categories,
  });

const useCatalogInvalidation = () => {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.categories }),
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.coursesAll }),
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.all }),
    ]);
};

export const useCreateCategory = () => {
  const invalidate = useCatalogInvalidation();
  return useMutation({
    mutationFn: adminCatalogApi.createCategory,
    meta: { successMessage: 'Category created', errorTitle: 'Could not create category' },
    onSuccess: invalidate,
  });
};

export const useUpdateCategory = () => {
  const invalidate = useCatalogInvalidation();
  return useMutation({
    mutationFn: adminCatalogApi.updateCategory,
    meta: { successMessage: 'Category updated', errorTitle: 'Could not update category' },
    onSuccess: invalidate,
  });
};

export const useDeleteCategory = () => {
  const invalidate = useCatalogInvalidation();
  return useMutation({
    mutationFn: adminCatalogApi.deleteCategory,
    meta: { successMessage: 'Category deleted', errorTitle: 'Could not delete category' },
    onSuccess: invalidate,
  });
};

export const useAdminCourses = (params: CourseListParams) =>
  useQuery({
    queryKey: queryKeys.admin.courses(params as QueryParams),
    queryFn: () => adminCatalogApi.courses(params),
    placeholderData: keepPreviousData,
    select: (result) => result.data,
  });

export const useCreateCourse = () => {
  const invalidate = useCatalogInvalidation();
  return useMutation({
    mutationFn: adminCatalogApi.createCourse,
    meta: { successMessage: 'Course created', errorTitle: 'Could not create course' },
    onSuccess: invalidate,
  });
};

export const useUpdateCourse = () => {
  const invalidate = useCatalogInvalidation();
  return useMutation({
    mutationFn: adminCatalogApi.updateCourse,
    meta: { successMessage: 'Course updated', errorTitle: 'Could not update course' },
    onSuccess: invalidate,
  });
};

export const useDeleteCourse = () => {
  const invalidate = useCatalogInvalidation();
  return useMutation({
    mutationFn: adminCatalogApi.deleteCourse,
    meta: { successMessage: 'Course removed', errorTitle: 'Could not remove course' },
    onSuccess: invalidate,
  });
};

export const useCourseOptions = () => {
  const query = useCourses({ page: 1, page_size: 100 });
  return {
    ...query,
    options: (query.data?.results ?? []).map((course) => ({ value: course.id, label: course.title })),
  };
};

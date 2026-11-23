import { ENDPOINTS } from '@/lib/api/endpoints';
import { api } from '@/lib/api/request';
import type { Paginated, QueryParams } from '@/types';
import type {
  CategoriesData,
  CategoryData,
  CategoryPayload,
  Course,
  CourseData,
  CourseListParams,
  CoursePayload,
} from '../types';

export const catalogApi = {
  categories: () => api.get<CategoriesData>(ENDPOINTS.catalog.categories),
  courses: (params: CourseListParams) => api.get<Paginated<Course>>(ENDPOINTS.catalog.courses, params as QueryParams),
  course: (idOrSlug: string | number) => api.get<CourseData>(ENDPOINTS.catalog.course(idOrSlug)),
};

export const adminCatalogApi = {
  categories: () => api.get<CategoriesData>(ENDPOINTS.admin.categories),
  category: (id: number) => api.get<CategoryData>(ENDPOINTS.admin.category(id)),
  createCategory: (payload: CategoryPayload) => api.post<CategoryData, CategoryPayload>(ENDPOINTS.admin.categories, payload),
  updateCategory: ({ id, ...payload }: Partial<CategoryPayload> & { id: number }) =>
    api.patch<CategoryData>(ENDPOINTS.admin.category(id), payload),
  deleteCategory: (id: number) => api.delete(ENDPOINTS.admin.category(id)),
  courses: (params: CourseListParams) => api.get<Paginated<Course>>(ENDPOINTS.admin.courses, params as QueryParams),
  course: (id: number) => api.get<CourseData>(ENDPOINTS.admin.course(id)),
  createCourse: (payload: CoursePayload) => api.post<CourseData, CoursePayload>(ENDPOINTS.admin.courses, payload),
  updateCourse: ({ id, ...payload }: Partial<CoursePayload> & { id: number }) =>
    api.patch<CourseData>(ENDPOINTS.admin.course(id), payload),
  deleteCourse: (id: number) => api.delete(ENDPOINTS.admin.course(id)),
};

import type { CategoryRef, FacultyRef, ListParams } from '@/types';

export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type CourseMode = 'ONLINE' | 'OFFLINE' | 'HYBRID';
export type CourseStatus = 'DRAFT' | 'ACTIVE' | 'UPCOMING' | 'ARCHIVED';

export const COURSE_LEVELS: { value: CourseLevel; label: string }[] = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
];

export const COURSE_MODES: { value: CourseMode; label: string }[] = [
  { value: 'ONLINE', label: 'Online' },
  { value: 'OFFLINE', label: 'Classroom' },
  { value: 'HYBRID', label: 'Hybrid' },
];

export const COURSE_STATUSES: { value: CourseStatus; label: string }[] = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'UPCOMING', label: 'Upcoming' },
  { value: 'ARCHIVED', label: 'Archived' },
];

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  course_count: number;
  created_at: string;
  updated_at: string;
}

export interface CategoriesData {
  categories: Category[];
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  category: CategoryRef;
  faculty: FacultyRef | null;
  level: CourseLevel | (string & {});
  level_display: string;
  mode: CourseMode | (string & {});
  mode_display: string;
  duration_weeks: number;
  total_modules: number;
  fee: number;
  start_date: string;
  thumbnail: string | null;
  status: CourseStatus | (string & {});
  status_display: string;
}

export interface CourseDetail extends Course {
  description: string;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
}

export interface CourseDetailData {
  course: CourseDetail;
}

export interface CourseListParams extends ListParams {
  category?: string;
  level?: string;
  mode?: string;
  status?: string;
  faculty?: string;
}

export interface CategoryPayload {
  name: string;
  description: string;
  is_active: boolean;
}

export interface CategoryData {
  category: Category;
}

export interface CoursePayload {
  title: string;
  short_description: string;
  description: string;
  category: number;
  faculty: string | null;
  level: CourseLevel;
  mode: CourseMode;
  duration_weeks: number;
  total_modules: number;
  fee: number;
  start_date: string;
  status: CourseStatus;
  meta_title: string;
  meta_description: string;
}

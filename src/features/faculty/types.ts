import type { Course } from '@/features/courses/types';
import type { ListParams, User } from '@/types';

export interface FacultyProfile {
  id: number;
  employee_code: string;
  user: User;
  designation: string;
  expertise: string;
  bio: string;
  photo: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminFaculty extends FacultyProfile {
  course_count: number;
  student_count: number;
}

export interface PublicFaculty {
  id: string;
  full_name: string;
  designation: string;
  expertise: string;
  bio: string;
  photo: string | null;
  course_count: number;
}

export interface PublicFacultyDetailData {
  faculty: PublicFaculty;
  courses: Course[];
}

export interface FacultyListParams extends ListParams {
  is_active?: string;
}

export interface CreateFacultyPayload {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  password: string;
  designation: string;
  expertise: string;
  bio: string;
}

export interface UpdateFacultyPayload {
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_active?: boolean;
  designation?: string;
  expertise?: string;
  bio?: string;
  photo?: File | null;
}

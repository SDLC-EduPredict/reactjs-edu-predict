import type { Course } from '@/features/courses/types';
import type { ListParams, User } from '@/types';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export const GENDERS: { value: Gender; label: string }[] = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

export interface StudentProfile {
  id: number;
  student_code: string;
  user: User;
  date_of_birth: string | null;
  gender: Gender | '' | (string & {});
  gender_display: string;
  highest_qualification: string;
  address: string;
  city: string;
  photo: string | null;
  profile_completion: number;
  missing_profile_fields: string[];
  created_at: string;
  updated_at: string;
}

export interface StudentProfileData {
  profile: StudentProfile;
}

export interface StudentDashboardData {
  profile: StudentProfile;
  summary: {
    profile_completion: number;
    email_verified: boolean;
    available_courses: number;
    course_categories: number;
  };
  latest_courses: Course[];
}

export interface StudentProfileFields {
  date_of_birth?: string | null;
  gender?: string;
  highest_qualification?: string;
  address?: string;
  city?: string;
}

export interface UpdateOwnProfilePayload extends StudentProfileFields {
  first_name?: string;
  last_name?: string;
  phone?: string;
  photo?: File | null;
}

export interface CreateStudentPayload extends StudentProfileFields {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  password: string;
}

export interface UpdateStudentPayload extends StudentProfileFields {
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_active?: boolean;
}

export interface StudentListParams extends ListParams {
  is_active?: string;
}

import type { ListParams, User } from '@/types';

export interface StudentProfile {
  id: number;
  student_code: string;
  user: User;
  date_of_birth?: string | null;
  gender?: string | null;
  address?: string | null;
  city?: string | null;
  qualification?: string | null;
  institution?: string | null;
  guardian_name?: string | null;
  guardian_phone?: string | null;
  photo?: string | null;
  enrolment_count?: number;
  created_at: string;
  updated_at: string;
}

export interface StudentProfileData {
  profile: StudentProfile;
}

export interface AdminStudentData {
  student: StudentProfile;
}

export interface StudentListParams extends ListParams {
  is_active?: string;
  course?: string;
}

export interface StudentProfileFields {
  date_of_birth?: string;
  gender?: string;
  address?: string;
  city?: string;
  qualification?: string;
  institution?: string;
  guardian_name?: string;
  guardian_phone?: string;
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

export interface UpdateOwnStudentProfilePayload extends StudentProfileFields {
  photo?: File | null;
}

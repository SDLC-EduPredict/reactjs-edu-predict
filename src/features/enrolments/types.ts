import type { CategoryRef, CourseRef, FacultyRef, ListParams, StudentRef } from '@/types';

export type EnrolmentStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'DROPPED' | 'CANCELLED';

export const ENROLMENT_STATUSES: { value: EnrolmentStatus; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'DROPPED', label: 'Dropped' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export interface EnrolmentCourse extends CourseRef {
  category?: CategoryRef;
  faculty?: FacultyRef | null;
  duration_weeks?: number;
  total_modules?: number;
  level_display?: string;
  mode_display?: string;
  start_date?: string;
}

export interface Enrolment {
  id: number;
  student?: StudentRef;
  course: EnrolmentCourse;
  status: EnrolmentStatus | (string & {});
  status_display?: string;
  enrolled_at: string;
  completed_at?: string | null;
  modules_completed?: number;
  progress_percentage?: number;
  remarks?: string | null;
}

export interface EnrolmentData {
  enrolment: Enrolment;
}

export interface EnrolmentListParams extends ListParams {
  status?: string;
  course?: string;
}

export interface EnrolPayload {
  course: number;
}

export interface UpdateEnrolmentPayload {
  status?: EnrolmentStatus;
  modules_completed?: number;
  remarks?: string;
}

export interface AdminCreateEnrolmentPayload {
  student: number;
  course: number;
  status?: EnrolmentStatus;
}

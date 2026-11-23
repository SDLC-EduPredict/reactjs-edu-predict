import type { Course } from '@/features/courses/types';
import type { CourseRef, EnrolmentProgress, EnrolmentStatus, ListParams, StudentRef } from '@/types';

export interface StudentEnrolment {
  id: number;
  course: Course;
  status: EnrolmentStatus | (string & {});
  status_display: string;
  enrolled_on: string;
  start_date: string;
  end_date: string;
  progress: EnrolmentProgress;
}

export interface Enrolment {
  id: number;
  student: StudentRef;
  course: CourseRef;
  status: EnrolmentStatus | (string & {});
  status_display: string;
  enrolled_on: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  progress?: EnrolmentProgress;
}

export interface EnrolmentListParams extends ListParams {
  status?: string;
  course?: string;
  student?: string;
}

export interface CreateEnrolmentPayload {
  student: number;
  course: number;
}

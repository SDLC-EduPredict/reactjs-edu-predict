import type { CourseRef, ListParams, StudentRef } from '@/types';

export type SubmissionStatus = 'PENDING' | 'SUBMITTED' | 'LATE' | 'GRADED';

export interface Submission {
  id: number;
  assignment?: { id: number; title: string; max_marks: number };
  student?: StudentRef;
  submission_text?: string | null;
  file?: string | null;
  submitted_at?: string | null;
  status: SubmissionStatus | (string & {});
  status_display?: string;
  marks_obtained?: number | null;
  feedback?: string | null;
  graded_at?: string | null;
}

export interface Assignment {
  id: number;
  course: CourseRef;
  title: string;
  description: string;
  due_date: string;
  max_marks: number;
  attachment?: string | null;
  is_published?: boolean;
  submission_count?: number;
  graded_count?: number;
  average_marks?: number | null;
  my_submission?: Submission | null;
  created_at?: string;
}

export interface AssignmentListParams extends ListParams {
  course?: string;
  status?: string;
}

export interface AssignmentPayload {
  course: number;
  title: string;
  description: string;
  due_date: string;
  max_marks: number;
  is_published: boolean;
}

export interface SubmitAssignmentPayload {
  submission_text?: string;
  file?: File | null;
}

export interface GradeSubmissionPayload {
  marks_obtained: number;
  feedback?: string;
}

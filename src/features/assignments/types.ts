import type { AssignmentProgress, CourseRef, ListParams, StudentRef } from '@/types';

export type SubmissionStatus = 'PENDING' | 'SUBMITTED' | 'GRADED';

export interface Submission {
  id: number;
  assignment: number;
  enrolment: number;
  status: SubmissionStatus | (string & {});
  status_display: string;
  submission_text: string;
  submission_link: string;
  submission_file: string | null;
  submitted_at: string | null;
  is_late: boolean;
  marks: number | null;
  percentage: number | null;
  feedback: string;
  graded_by: string | null;
  graded_at: string | null;
}

export interface Assignment {
  id: number;
  course: CourseRef;
  title: string;
  description: string;
  due_date: string;
  max_marks: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudentAssignmentItem {
  id: number;
  title: string;
  description: string;
  due_date: string;
  max_marks: number;
  my_status: SubmissionStatus | (string & {});
  my_submission: Submission | null;
}

export interface StudentAssignmentsCourse {
  enrolment_id: number;
  course: CourseRef;
  summary: AssignmentProgress;
  assignments: StudentAssignmentItem[];
}

export interface SubmissionsData {
  assignment: Assignment;
  students: { enrolment_id: number; student: StudentRef; status: string; submission: Submission | null }[];
}

export interface AssignmentListParams extends ListParams {
  course?: string;
}

export interface AssignmentPayload {
  course: number;
  title: string;
  description: string;
  due_date: string;
  max_marks: number;
}

export interface SubmitPayload {
  submission_text: string;
  submission_link: string;
  submission_file: File | null;
}

export interface GradePayload {
  records: { enrolment: number; marks: number; feedback?: string }[];
}

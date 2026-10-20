import type { CourseRef, ListParams, StudentRef } from '@/types';

export type AssessmentType = 'MOCK_TEST' | 'QUIZ' | 'MIDTERM' | 'FINAL';

export const ASSESSMENT_TYPES: { value: AssessmentType; label: string }[] = [
  { value: 'MOCK_TEST', label: 'Mock test' },
  { value: 'QUIZ', label: 'Module quiz' },
  { value: 'MIDTERM', label: 'Mid-term exam' },
  { value: 'FINAL', label: 'Final exam' },
];

export interface Assessment {
  id: number;
  course: CourseRef;
  title: string;
  description?: string;
  assessment_type: AssessmentType | (string & {});
  assessment_type_display?: string;
  scheduled_date: string;
  duration_minutes: number;
  total_marks: number;
  passing_marks?: number;
  is_published: boolean;
  result_count?: number;
  average_marks?: number | null;
  created_at?: string;
}

export interface AssessmentResult {
  id: number;
  assessment: Pick<Assessment, 'id' | 'title' | 'assessment_type' | 'total_marks'> & {
    assessment_type_display?: string;
    scheduled_date?: string;
    course?: CourseRef;
  };
  student?: StudentRef;
  marks_obtained: number;
  percentage?: number;
  is_passed?: boolean;
  remarks?: string | null;
  published_at?: string | null;
}

export interface AssessmentListParams extends ListParams {
  course?: string;
  assessment_type?: string;
}

export interface AssessmentPayload {
  course: number;
  title: string;
  description: string;
  assessment_type: AssessmentType;
  scheduled_date: string;
  duration_minutes: number;
  total_marks: number;
  passing_marks: number;
  is_published: boolean;
}

export interface RecordResultPayload {
  enrolment: number;
  marks_obtained: number;
  remarks?: string;
}

import type { AssessmentProgress, CourseRef, ListParams, StudentRef } from '@/types';

export type AssessmentType = 'MOCK_TEST' | 'EXAM';

export const ASSESSMENT_TYPES: { value: AssessmentType; label: string }[] = [
  { value: 'MOCK_TEST', label: 'Mock Test' },
  { value: 'EXAM', label: 'Exam' },
];

export interface Assessment {
  id: number;
  course: CourseRef;
  title: string;
  assessment_type: AssessmentType | (string & {});
  assessment_type_display: string;
  description: string;
  assessment_date: string;
  max_marks: number;
  pass_marks: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssessmentResult {
  id: number;
  assessment: number;
  enrolment: number;
  student: StudentRef;
  marks_obtained: number;
  percentage: number;
  result: 'PASS' | 'FAIL' | (string & {});
  remarks: string;
  entered_by: string | null;
  updated_at: string;
}

export interface AssessmentResultsData {
  assessment: Assessment;
  students: { enrolment_id: number; student: StudentRef; result: AssessmentResult | null }[];
}

export interface StudentAssessmentItem {
  id: number;
  title: string;
  assessment_type?: string;
  assessment_type_display?: string;
  assessment_date?: string;
  max_marks?: number;
  pass_marks?: number;
  marks_obtained?: number | null;
  percentage?: number | null;
  result?: string | AssessmentResult | null;
  remarks?: string;
}

export interface StudentResultsCourse {
  enrolment_id: number;
  course: CourseRef;
  summary: AssessmentProgress;
  assessments: StudentAssessmentItem[];
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
  assessment_date: string;
  max_marks: number;
  pass_marks: number;
}

export interface EnterMarksPayload {
  records: { enrolment: number; marks_obtained: number; remarks?: string }[];
}

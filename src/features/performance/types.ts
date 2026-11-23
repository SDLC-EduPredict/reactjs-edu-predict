import type { CourseRef, EnrolmentStatus, ListParams, PerformanceIndicator, StudentRef } from '@/types';

export type Participation = 'LOW' | 'MEDIUM' | 'HIGH';

export const PARTICIPATION_LEVELS: { value: Participation; label: string }[] = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
];

export interface PerformanceMetrics {
  attendance_percentage: number | null;
  assignment_average: number | null;
  mock_test_average: number | null;
  exam_average: number | null;
  assessment_average: number | null;
  practice_hours: number | null;
  previous_score: number | null;
  modules_completed_percentage: number | null;
  overall_score: number | null;
  indicator: PerformanceIndicator | (string & {});
  indicator_display: string;
}

export interface PerformanceSnapshot extends PerformanceMetrics {
  id: number;
  modules_completed: number | null;
  total_modules: number;
  participation: Participation | '' | (string & {});
  participation_display: string;
  participation_score: number | null;
  calculated_at: string;
}

export interface PerformanceRecord extends PerformanceSnapshot {
  enrolment: number;
  enrolment_status: EnrolmentStatus | (string & {});
  student: StudentRef;
  course: CourseRef;
  updated_by: string | null;
  updated_at: string;
}

export interface StudentPerformanceData {
  overall: PerformanceMetrics & { courses: number };
  courses: { enrolment_id: number; course: CourseRef; performance: PerformanceSnapshot }[];
}

export interface PerformanceSummaryData {
  course: CourseRef;
  summary: PerformanceMetrics & {
    students: number;
    indicators: Partial<Record<PerformanceIndicator, number>>;
  };
  students: PerformanceRecord[];
}

export interface PerformanceDataset {
  features: string[];
  target: string;
  count: number;
  rows: Record<string, string | number | null>[];
}

export interface PerformanceListParams extends ListParams {
  course?: string;
  score?: string;
  indicator?: string;
  status?: string;
  participation?: string;
  ordering?: string;
}

export interface UpdatePerformancePayload {
  practice_hours?: number | null;
  previous_score?: number | null;
  modules_completed?: number | null;
  participation?: Participation | '';
}

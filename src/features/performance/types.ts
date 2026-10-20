import type { CourseRef, ListParams, PerformanceIndicator, StudentRef } from '@/types';

export type ClassParticipation = 'LOW' | 'MEDIUM' | 'HIGH';

export interface PerformanceSnapshot {
  id?: number;
  enrolment?: number;
  student?: StudentRef;
  course?: CourseRef;
  attendance_percentage: number;
  assignment_average: number;
  mock_test_average: number;
  practice_hours_per_week?: number;
  previous_score?: number;
  modules_completed?: number;
  class_participation?: ClassParticipation | (string & {});
  overall_score?: number;
  indicator: PerformanceIndicator | (string & {});
  indicator_display?: string;
  updated_at?: string;
}

export interface PredictionSummary {
  predicted_score: number;
  indicator: PerformanceIndicator | (string & {});
  indicator_display?: string;
  created_at?: string;
}

export interface MonitoredStudent {
  enrolment_id?: number;
  id?: number;
  student: StudentRef;
  course: CourseRef;
  enrolment_status?: string;
  performance?: PerformanceSnapshot | null;
  prediction?: PredictionSummary | null;
  reasons?: string[];
}

export interface MonitoredStudentListParams extends ListParams {
  course?: string;
  indicator?: string;
}

export interface StudentReport {
  student: StudentRef & { phone?: string };
  enrolments?: {
    id: number;
    course: CourseRef;
    status?: string;
    performance?: PerformanceSnapshot | null;
    prediction?: PredictionSummary | null;
    reasons?: string[];
  }[];
}

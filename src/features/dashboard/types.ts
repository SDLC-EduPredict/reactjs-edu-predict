import type { Enrolment } from '@/features/enrolments/types';
import type { MonitoredStudent } from '@/features/performance/types';
import type { CourseRef } from '@/types';

export interface IndicatorCount {
  indicator: string;
  indicator_display?: string;
  count: number;
}

export interface CourseSummaryRow {
  course?: CourseRef;
  course_title?: string;
  title?: string;
  enrolments?: number;
  active_enrolments?: number;
  average_attendance?: number;
  average_score?: number;
  average_predicted_score?: number;
  needs_attention?: number;
}

export interface DashboardData {
  stats?: Record<string, number>;
  totals?: Record<string, number>;
  indicator_distribution?: IndicatorCount[];
  recent_enrolments?: Enrolment[];
  courses?: CourseSummaryRow[];
  top_courses?: CourseSummaryRow[];
  students_needing_attention?: MonitoredStudent[];
  [key: string]: unknown;
}

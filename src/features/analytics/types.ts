import type { Enrolment } from '@/features/enrolments/types';
import type { PerformanceMetrics, PerformanceSnapshot } from '@/features/performance/types';
import type { PredictionListRow, PredictionRecord } from '@/features/predictions/types';
import type { StudentProfile } from '@/features/students/types';
import type {
  AnalyticsSummary,
  AttentionRow,
  CourseAnalyticsRow,
  IndicatorCounts,
  ListParams,
  ModelVersionRef,
  PredictionStats,
  User,
} from '@/types';

export interface FacultyDashboardData {
  summary: AnalyticsSummary;
  work: {
    submissions_to_grade: number;
    assignments_due_soon: number;
    upcoming_assessments: number;
    attendance_marked_today: number;
    unread_notifications: number;
  };
  courses: CourseAnalyticsRow[];
  performance_indicators: IndicatorCounts;
  predictions: PredictionStats;
  students_needing_attention: AttentionRow[];
  submissions_to_grade: Record<string, unknown>[];
  upcoming_assessments: Record<string, unknown>[];
  assignments_due_soon: Record<string, unknown>[];
}

export interface FacultyStudentDetail {
  profile: StudentProfile;
  overall: PerformanceMetrics & { courses: number };
  courses: (Enrolment & { performance: PerformanceSnapshot | null; prediction: PredictionRecord | null })[];
}

export interface AdminDashboardData {
  summary: AnalyticsSummary;
  people: {
    active_students: number;
    inactive_students: number;
    active_faculty: number;
    pending_faculty_approvals: number;
    admins: number;
  };
  courses: Record<string, number>;
  enrolments: Record<string, number>;
  academic_records: Record<string, number>;
  performance_indicators: IndicatorCounts;
  predictions: PredictionStats;
  active_model: ModelVersionRef | null;
  students_needing_attention: AttentionRow[];
  latest_predictions: PredictionListRow[];
  recent_enrolments: Enrolment[];
  pending_faculty: User[];
}

export interface ReportOverview {
  overview: AnalyticsSummary;
  enrolments: Record<string, number>;
  performance_indicators: IndicatorCounts;
  predictions: PredictionStats;
}

export interface CoursePerformanceReport {
  count: number;
  courses: CourseAnalyticsRow[];
}

export interface PredictionDistribution extends PredictionStats {
  active_model: ModelVersionRef | null;
}

export interface FacultyStudentListParams extends ListParams {
  course?: string;
  indicator?: string;
}

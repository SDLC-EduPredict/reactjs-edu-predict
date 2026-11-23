export interface CategoryRef {
  id: number;
  name: string;
  slug: string;
}

export interface CourseRef {
  id: number;
  title: string;
  slug: string;
}

export interface FacultyRef {
  id: string;
  full_name: string;
  designation: string;
  expertise: string;
  bio: string;
  photo: string | null;
}

export interface StudentRef {
  id: number;
  student_code: string;
  full_name: string;
  email: string;
}

export const INDICATORS = ['GOOD', 'AVERAGE', 'NEEDS_ATTENTION', 'NO_DATA'] as const;
export type PerformanceIndicator = (typeof INDICATORS)[number];
export type IndicatorCounts = Partial<Record<PerformanceIndicator, number>>;

export interface ModelVersionRef {
  id: number;
  name: string;
  algorithm: string;
  r2_score: number;
  rmse: number;
  created_at: string;
}

export interface AttendanceProgress {
  total_classes: number;
  present: number;
  late: number;
  absent: number;
  attendance_percentage: number | null;
}

export interface AssignmentProgress {
  total_assignments: number;
  submitted: number;
  graded: number;
  not_submitted: number;
  assignment_average: number | null;
}

export interface AssessmentProgress {
  total_assessments: number;
  attempted: number;
  passed: number;
  mock_test_average: number | null;
  exam_average: number | null;
  assessment_average: number | null;
}

export interface EnrolmentProgress {
  attendance: AttendanceProgress;
  assignments: AssignmentProgress;
  assessments: AssessmentProgress;
}

export type EnrolmentStatus = 'ACTIVE' | 'COMPLETED' | 'DROPPED';

export const ENROLMENT_STATUSES: { value: EnrolmentStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'DROPPED', label: 'Dropped' },
];

export interface ScoreBand {
  band: string;
  count: number;
}

export interface PredictionStats {
  total_predictions: number;
  average_predicted_score: number | null;
  lowest_predicted_score: number | null;
  highest_predicted_score: number | null;
  indicators: IndicatorCounts;
  score_bands: ScoreBand[];
}

export interface AttentionRow {
  id: number;
  enrolment: number;
  enrolment_status: EnrolmentStatus | (string & {});
  student_id: number;
  student_code: string;
  student_name: string;
  email: string;
  course_id: number;
  course: string;
  faculty: string;
  attendance_percentage: number | null;
  assignment_average: number | null;
  mock_test_average: number | null;
  exam_average: number | null;
  assessment_average: number | null;
  overall_score: number | null;
  indicator: PerformanceIndicator | (string & {});
  predicted_final_score: number | null;
  prediction_indicator: PerformanceIndicator | (string & {}) | null;
  reasons: string[];
}

export interface CourseAnalyticsRow {
  id: number;
  title: string;
  category: string;
  faculty: string;
  status: string;
  students: number;
  average_attendance: number | null;
  average_assignment_score: number | null;
  average_assessment_score: number | null;
  average_performance: number | null;
  average_predicted_score: number | null;
  low_attendance_students: number;
  good: number;
  average: number;
  needs_attention: number;
  no_data: number;
}

export interface AnalyticsSummary {
  total_students: number;
  total_courses: number;
  active_enrolments: number;
  average_attendance: number | null;
  average_assignment_score: number | null;
  average_assessment_score: number | null;
  average_performance: number | null;
  average_predicted_score: number | null;
  students_needing_attention: number;
  enrolments_needing_attention: number;
}

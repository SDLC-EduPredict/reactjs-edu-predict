import type { CourseRef, PerformanceIndicator, StudentRef } from '@/types';

export interface PredictionFeatures {
  attendance_percentage: number;
  assignment_average: number;
  mock_test_average: number;
  practice_hours_per_week: number;
  previous_score: number;
  modules_completed: number;
}

export interface PredictPayload extends Partial<PredictionFeatures> {
  student_id?: number;
  enrolment_id?: number;
  course_id?: number;
}

export interface FeatureContribution {
  feature: string;
  label?: string;
  value: number;
  coefficient?: number;
  contribution?: number;
}

export interface ModelMetrics {
  mae?: number;
  mse?: number;
  rmse?: number;
  r2?: number;
}

export interface Prediction {
  id: number;
  student?: StudentRef;
  course?: CourseRef | null;
  predicted_score: number;
  indicator: PerformanceIndicator;
  indicator_display?: string;
  features?: Partial<PredictionFeatures>;
  contributions?: FeatureContribution[];
  reasons?: string[];
  model_version?: string;
  metrics?: ModelMetrics;
  created_at?: string;
}

export interface PredictResponseData {
  prediction: Prediction;
}

export interface StudentPredictionsData {
  predictions?: Prediction[];
  prediction?: Prediction;
  latest?: Prediction;
}

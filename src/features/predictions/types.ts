import type { CourseRef, EnrolmentStatus, ListParams, ModelVersionRef, PerformanceIndicator, StudentRef } from '@/types';

export interface FeatureValues {
  attendance: number | null;
  assignment_average: number | null;
  mock_test_average: number | null;
  practice_hours: number | null;
  previous_score: number | null;
  modules_completed: number | null;
}

export type FeatureKey = keyof FeatureValues;

export interface PredictionRecord extends FeatureValues {
  id: number;
  predicted_final_score: number;
  indicator: PerformanceIndicator | (string & {});
  indicator_display: string;
  model_version: ModelVersionRef | null;
  updated_at: string;
}

export interface PredictionListRow extends PredictionRecord {
  enrolment: number;
  enrolment_status: EnrolmentStatus | (string & {});
  student: StudentRef;
  course: CourseRef;
}

export interface CoursePrediction {
  enrolment_id: number;
  course: CourseRef;
  features: FeatureValues;
  missing_features: string[];
  prediction: PredictionRecord | null;
}

export interface StudentPredictionsData {
  courses: CoursePrediction[];
  note: string;
}

export interface StaffStudentPredictionData extends StudentPredictionsData {
  student: StudentRef;
}

export interface WhatIfResult {
  predicted_final_score: number;
  max_score: number;
  indicator: PerformanceIndicator | (string & {});
  indicator_display: string;
  input: Record<FeatureKey, number>;
  model_version: ModelVersionRef;
  note: string;
}

export interface EnrolmentPredictionResult extends CoursePrediction {
  student: StudentRef;
  note: string;
}

export type PredictResult = WhatIfResult | EnrolmentPredictionResult;

export type PredictPayload = { enrolment: number } | Record<FeatureKey, number>;

export interface MlModel {
  id: number;
  name: string;
  version: number;
  algorithm: string;
  is_active: boolean;
  data_source: 'SAMPLE' | 'CSV' | 'DATABASE' | (string & {});
  data_source_display: string;
  source_name: string;
  features: string[];
  target: string;
  total_rows: number;
  cleaned_rows: number;
  training_rows: number;
  test_rows: number;
  mae: number;
  mse: number;
  rmse: number;
  r2_score: number;
  intercept: number;
  coefficients: Record<string, number>;
  feature_means: Record<string, number>;
  correlations: Record<string, number>;
  trained_by: string | null;
  created_at: string;
}

export interface ModelsData {
  active_model: MlModel | null;
  models: MlModel[];
}

export type TrainSource = 'SAMPLE' | 'DATABASE' | 'CSV';

export interface TrainPayload {
  source: TrainSource;
  file?: File | null;
}

export interface PredictionListParams extends ListParams {
  course?: string;
  indicator?: string;
  status?: string;
  ordering?: string;
}

export const isWhatIfResult = (value: PredictResult): value is WhatIfResult => 'predicted_final_score' in value;

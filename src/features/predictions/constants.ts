import type { PredictionFeatures } from './types';

export const FEATURE_META: Record<keyof PredictionFeatures, { label: string; unit: string; max: number; step: number }> = {
  attendance_percentage: { label: 'Attendance', unit: '%', max: 100, step: 1 },
  assignment_average: { label: 'Assignment average', unit: '', max: 100, step: 1 },
  mock_test_average: { label: 'Mock test average', unit: '', max: 100, step: 1 },
  practice_hours_per_week: { label: 'Practice hours / week', unit: 'h', max: 40, step: 1 },
  previous_score: { label: 'Previous score', unit: '', max: 100, step: 1 },
  modules_completed: { label: 'Modules completed', unit: '%', max: 100, step: 1 },
};

export const FEATURE_KEYS = Object.keys(FEATURE_META) as (keyof PredictionFeatures)[];

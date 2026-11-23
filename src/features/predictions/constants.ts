import type { FeatureKey } from './types';

export const FEATURE_META: Record<FeatureKey, { label: string; short: string; unit: string; max: number; step: number }> = {
  attendance: { label: 'Attendance Percentage', short: 'Attendance', unit: '%', max: 100, step: 1 },
  assignment_average: { label: 'Assignment Average', short: 'Assignments', unit: '/100', max: 100, step: 1 },
  mock_test_average: { label: 'Mock Test Average', short: 'Mock Tests', unit: '/100', max: 100, step: 1 },
  practice_hours: { label: 'Practice Hours / Week', short: 'Practice', unit: ' hrs', max: 40, step: 0.5 },
  previous_score: { label: 'Previous Score', short: 'Previous', unit: '/100', max: 100, step: 1 },
  modules_completed: { label: 'Modules Completed', short: 'Modules', unit: '%', max: 100, step: 1 },
};

export const FEATURE_KEYS = Object.keys(FEATURE_META) as FeatureKey[];

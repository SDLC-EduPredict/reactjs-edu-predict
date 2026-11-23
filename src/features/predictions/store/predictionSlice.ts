import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store/store';
import type { FeatureKey, PredictResult } from '../types';

export interface PredictionState {
  simulator: Record<FeatureKey, number>;
  lastResult: PredictResult | null;
  selectedStudentId: number | null;
}

export const DEFAULT_FEATURES: Record<FeatureKey, number> = {
  attendance: 88,
  assignment_average: 84,
  mock_test_average: 78,
  practice_hours: 10,
  previous_score: 80,
  modules_completed: 90,
};

const initialState: PredictionState = {
  simulator: DEFAULT_FEATURES,
  lastResult: null,
  selectedStudentId: null,
};

const predictionSlice = createSlice({
  name: 'prediction',
  initialState,
  reducers: {
    featureChanged(state, action: PayloadAction<{ key: FeatureKey; value: number }>) {
      state.simulator[action.payload.key] = action.payload.value;
    },
    featuresLoaded(state, action: PayloadAction<Partial<Record<FeatureKey, number | null>>>) {
      for (const [key, value] of Object.entries(action.payload)) {
        if (typeof value === 'number') state.simulator[key as FeatureKey] = value;
      }
    },
    featuresReset(state) {
      state.simulator = DEFAULT_FEATURES;
      state.lastResult = null;
    },
    predictionReceived(state, action: PayloadAction<PredictResult>) {
      state.lastResult = action.payload;
    },
    studentSelected(state, action: PayloadAction<number | null>) {
      state.selectedStudentId = action.payload;
    },
  },
});

export const selectSimulator = (state: RootState) => state.prediction.simulator;
export const selectLastPrediction = (state: RootState) => state.prediction.lastResult;
export const selectSelectedStudentId = (state: RootState) => state.prediction.selectedStudentId;

export const { featureChanged, featuresLoaded, featuresReset, predictionReceived, studentSelected } =
  predictionSlice.actions;
export default predictionSlice.reducer;

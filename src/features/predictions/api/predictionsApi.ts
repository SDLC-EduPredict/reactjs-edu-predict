import { ENDPOINTS } from '@/lib/api/endpoints';
import { api } from '@/lib/api/request';
import type { PredictPayload, PredictResponseData } from '../types';

export const predictionsApi = {
  predict: (payload: PredictPayload) => api.post<PredictResponseData, PredictPayload>(ENDPOINTS.ml.predict, payload),
  forStudent: (studentId: number | string) => api.get<unknown>(ENDPOINTS.ml.prediction(studentId)),
};

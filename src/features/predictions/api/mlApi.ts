import { ENDPOINTS } from '@/lib/api/endpoints';
import { api, toFormData } from '@/lib/api/request';
import type { Paginated, QueryParams } from '@/types';
import type {
  MlModel,
  ModelsData,
  PredictPayload,
  PredictResult,
  PredictionListParams,
  PredictionListRow,
  StaffStudentPredictionData,
  StudentPredictionsData,
  TrainPayload,
} from '../types';

export const mlApi = {
  mine: (course?: number) => api.get<StudentPredictionsData>(ENDPOINTS.student.prediction, { course }),
  predictions: (params: PredictionListParams) =>
    api.get<Paginated<PredictionListRow>>(ENDPOINTS.ml.predictions, params as QueryParams),
  studentPrediction: (studentId: number) => api.get<StaffStudentPredictionData>(ENDPOINTS.ml.studentPrediction(studentId)),
  predict: (payload: PredictPayload) => api.post<PredictResult, PredictPayload>(ENDPOINTS.ml.predict, payload),
  train: (payload: TrainPayload) =>
    api.post<{ model: MlModel }>(
      ENDPOINTS.ml.train,
      payload.source === 'CSV' && payload.file ? toFormData({ source: 'CSV', file: payload.file }) : { source: payload.source },
    ),
  models: () => api.get<ModelsData>(ENDPOINTS.ml.models),
  activate: (id: number) => api.post<{ model: MlModel }>(ENDPOINTS.ml.activateModel(id)),
};

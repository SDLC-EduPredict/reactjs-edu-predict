import { ENDPOINTS } from '@/lib/api/endpoints';
import { api } from '@/lib/api/request';
import type { Paginated, QueryParams } from '@/types';
import type {
  Assessment,
  AssessmentListParams,
  AssessmentPayload,
  AssessmentResult,
  RecordResultPayload,
} from '../types';

export const assessmentsApi = {
  myResults: (params: QueryParams) => api.get<unknown>(ENDPOINTS.student.results, params),
  list: (params: AssessmentListParams) =>
    api.get<Paginated<Assessment>>(ENDPOINTS.academics.assessments, params as QueryParams),
  create: (payload: AssessmentPayload) =>
    api.post<{ assessment: Assessment }, AssessmentPayload>(ENDPOINTS.academics.assessments, payload),
  update: ({ id, ...payload }: Partial<AssessmentPayload> & { id: number }) =>
    api.patch<{ assessment: Assessment }>(ENDPOINTS.academics.assessment(id), payload),
  remove: (id: number) => api.delete(ENDPOINTS.academics.assessment(id)),
  results: (assessmentId: number) => api.get<unknown>(ENDPOINTS.academics.assessmentResults(assessmentId)),
  recordResult: ({ assessmentId, ...payload }: RecordResultPayload & { assessmentId: number }) =>
    api.post<{ result: AssessmentResult }, RecordResultPayload>(ENDPOINTS.academics.assessmentResults(assessmentId), payload),
};

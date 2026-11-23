import { ENDPOINTS } from '@/lib/api/endpoints';
import { api } from '@/lib/api/request';
import type { Paginated, QueryParams } from '@/types';
import type {
  Assessment,
  AssessmentListParams,
  AssessmentPayload,
  AssessmentResult,
  AssessmentResultsData,
  EnterMarksPayload,
  StudentResultsCourse,
} from '../types';

export const assessmentsApi = {
  myResults: () => api.get<{ courses: StudentResultsCourse[] }>(ENDPOINTS.student.results),
  list: (params: AssessmentListParams) =>
    api.get<Paginated<Assessment>>(ENDPOINTS.assessments.list, params as QueryParams),
  detail: (id: number) => api.get<{ assessment: Assessment }>(ENDPOINTS.assessments.detail(id)),
  create: (payload: AssessmentPayload) =>
    api.post<{ assessment: Assessment }, AssessmentPayload>(ENDPOINTS.assessments.list, payload),
  update: ({ id, ...payload }: Partial<AssessmentPayload> & { id: number }) =>
    api.patch<{ assessment: Assessment }>(ENDPOINTS.assessments.detail(id), payload),
  remove: (id: number) => api.delete(ENDPOINTS.assessments.detail(id)),
  results: (id: number) => api.get<AssessmentResultsData>(ENDPOINTS.assessments.results(id)),
  enterMarks: ({ id, ...payload }: EnterMarksPayload & { id: number }) =>
    api.post<{ results: AssessmentResult[] }, EnterMarksPayload>(ENDPOINTS.assessments.results(id), payload),
  deleteResult: (resultId: number) => api.delete(ENDPOINTS.assessments.result(resultId)),
};

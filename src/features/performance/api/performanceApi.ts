import { ENDPOINTS } from '@/lib/api/endpoints';
import { api, downloadFile } from '@/lib/api/request';
import type { Paginated, QueryParams } from '@/types';
import type {
  PerformanceDataset,
  PerformanceListParams,
  PerformanceRecord,
  PerformanceSummaryData,
  StudentPerformanceData,
  UpdatePerformancePayload,
} from '../types';

export const performanceApi = {
  mine: () => api.get<StudentPerformanceData>(ENDPOINTS.student.performance),
  list: (params: PerformanceListParams) =>
    api.get<Paginated<PerformanceRecord>>(ENDPOINTS.performance.list, params as QueryParams),
  summary: (courseId: number) => api.get<PerformanceSummaryData>(ENDPOINTS.performance.summary, { course: courseId }),
  dataset: (courseId: number | null) =>
    api.get<PerformanceDataset>(courseId ? ENDPOINTS.performance.datasetFor(courseId) : ENDPOINTS.performance.dataset),
  exportDataset: () => downloadFile(ENDPOINTS.performance.dataset, { export: 'csv' }, 'performance-dataset.csv'),
  detail: (id: number) => api.get<{ performance: PerformanceRecord }>(ENDPOINTS.performance.detail(id)),
  update: ({ id, ...payload }: UpdatePerformancePayload & { id: number }) =>
    api.patch<{ performance: PerformanceRecord }, UpdatePerformancePayload>(ENDPOINTS.performance.detail(id), payload),
};

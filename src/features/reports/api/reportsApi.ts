import { ENDPOINTS } from '@/lib/api/endpoints';
import { api, downloadFile } from '@/lib/api/request';

export const reportsApi = {
  overview: () => api.get<unknown>(ENDPOINTS.reports.overview),
  coursePerformance: () => api.get<unknown>(ENDPOINTS.reports.coursePerformance),
  studentsNeedingAttention: () => api.get<unknown>(ENDPOINTS.reports.studentsNeedingAttention),
  predictionDistribution: () => api.get<unknown>(ENDPOINTS.reports.predictionDistribution),
  exportCoursePerformance: () =>
    downloadFile(ENDPOINTS.reports.coursePerformance, { export: 'csv' }, 'course-performance.csv'),
  exportStudentsNeedingAttention: () =>
    downloadFile(ENDPOINTS.reports.studentsNeedingAttention, { export: 'csv' }, 'students-needing-attention.csv'),
};

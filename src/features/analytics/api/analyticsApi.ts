import { ENDPOINTS } from '@/lib/api/endpoints';
import { api, downloadFile } from '@/lib/api/request';
import type { AttentionRow, ListParams, Paginated, QueryParams } from '@/types';
import type {
  AdminDashboardData,
  CoursePerformanceReport,
  FacultyDashboardData,
  FacultyStudentDetail,
  FacultyStudentListParams,
  PredictionDistribution,
  ReportOverview,
} from '../types';

export const analyticsApi = {
  facultyDashboard: () => api.get<FacultyDashboardData>(ENDPOINTS.faculty.dashboard),
  facultyStudents: (params: FacultyStudentListParams) =>
    api.get<Paginated<AttentionRow>>(ENDPOINTS.faculty.students, params as QueryParams),
  facultyStudent: (studentId: number) => api.get<FacultyStudentDetail>(ENDPOINTS.faculty.student(studentId)),
  adminDashboard: () => api.get<AdminDashboardData>(ENDPOINTS.admin.dashboard),
  overview: () => api.get<ReportOverview>(ENDPOINTS.reports.overview),
  coursePerformance: () => api.get<CoursePerformanceReport>(ENDPOINTS.reports.coursePerformance),
  studentsNeedingAttention: (params: ListParams) =>
    api.get<Paginated<AttentionRow>>(ENDPOINTS.reports.studentsNeedingAttention, params as QueryParams),
  predictionDistribution: () => api.get<PredictionDistribution>(ENDPOINTS.reports.predictionDistribution),
  exportCoursePerformance: () =>
    downloadFile(ENDPOINTS.reports.coursePerformance, { export: 'csv' }, 'course-performance.csv'),
  exportStudentsNeedingAttention: () =>
    downloadFile(ENDPOINTS.reports.studentsNeedingAttention, { export: 'csv' }, 'students-needing-attention.csv'),
};

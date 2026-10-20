import { ENDPOINTS } from '@/lib/api/endpoints';
import { api } from '@/lib/api/request';
import type { QueryParams } from '@/types';
import type { MonitoredStudentListParams, StudentReport } from '../types';

export const performanceApi = {
  mine: () => api.get<unknown>(ENDPOINTS.student.performance),
  monitoredStudents: (params: MonitoredStudentListParams) =>
    api.get<unknown>(ENDPOINTS.faculty.students, params as QueryParams),
  studentReport: (studentId: number) => api.get<StudentReport>(ENDPOINTS.faculty.student(studentId)),
};

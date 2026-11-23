import { ENDPOINTS } from '@/lib/api/endpoints';
import { api } from '@/lib/api/request';
import type { Paginated, QueryParams } from '@/types';
import type {
  AttendanceListParams,
  AttendanceRecord,
  AttendanceStatus,
  AttendanceSummaryData,
  MarkAttendancePayload,
  StudentAttendanceCourse,
} from '../types';

export const attendanceApi = {
  mine: () => api.get<{ courses: StudentAttendanceCourse[] }>(ENDPOINTS.student.attendance),
  list: (params: AttendanceListParams) =>
    api.get<Paginated<AttendanceRecord>>(ENDPOINTS.attendance.list, params as QueryParams),
  mark: (payload: MarkAttendancePayload) =>
    api.post<{ date: string; records: AttendanceRecord[] }, MarkAttendancePayload>(ENDPOINTS.attendance.list, payload),
  summary: (courseId: number) => api.get<AttendanceSummaryData>(ENDPOINTS.attendance.summary, { course: courseId }),
  detail: (id: number) => api.get<{ attendance: AttendanceRecord }>(ENDPOINTS.attendance.detail(id)),
  update: ({ id, ...payload }: { id: number; status?: AttendanceStatus; remarks?: string }) =>
    api.patch<{ attendance: AttendanceRecord }>(ENDPOINTS.attendance.detail(id), payload),
  remove: (id: number) => api.delete(ENDPOINTS.attendance.detail(id)),
};

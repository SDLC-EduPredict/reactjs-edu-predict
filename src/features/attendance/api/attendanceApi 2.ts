import { ENDPOINTS } from '@/lib/api/endpoints';
import { api } from '@/lib/api/request';
import type { Paginated, QueryParams } from '@/types';
import type {
  AttendanceListParams,
  AttendanceRecord,
  MarkAttendancePayload,
  UpdateAttendancePayload,
} from '../types';

export const attendanceApi = {
  mine: (params: QueryParams) => api.get<unknown>(ENDPOINTS.student.attendance, params),
  list: (params: AttendanceListParams) =>
    api.get<Paginated<AttendanceRecord>>(ENDPOINTS.academics.attendance, params as QueryParams),
  mark: (payload: MarkAttendancePayload) =>
    api.post<{ attendance: AttendanceRecord }, MarkAttendancePayload>(ENDPOINTS.academics.attendance, payload),
  update: ({ id, ...payload }: UpdateAttendancePayload & { id: number }) =>
    api.patch<{ attendance: AttendanceRecord }, UpdateAttendancePayload>(ENDPOINTS.academics.attendanceRecord(id), payload),
  remove: (id: number) => api.delete(ENDPOINTS.academics.attendanceRecord(id)),
};

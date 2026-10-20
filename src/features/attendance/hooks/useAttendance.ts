import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { asList, isRecord } from '@/lib/api/normalize';
import { queryKeys } from '@/lib/query/queryKeys';
import type { QueryParams } from '@/types';
import { attendanceApi } from '../api/attendanceApi';
import type { AttendanceListParams, AttendanceRecord, AttendanceSummary, MarkAttendancePayload } from '../types';

export interface StudentAttendanceView {
  summary: AttendanceSummary[];
  records: AttendanceRecord[];
  overall: number | null;
}

export const useMyAttendance = (params: QueryParams = {}) =>
  useQuery({
    queryKey: queryKeys.studentPortal.attendance(params),
    queryFn: () => attendanceApi.mine(params),
    select: (result): StudentAttendanceView => {
      const data = result.data;
      const summary = asList<AttendanceSummary>(data, ['summary', 'courses']);
      const records = asList<AttendanceRecord>(data, ['records', 'attendance']);
      const overallValue = isRecord(data) ? data.overall_percentage ?? data.attendance_percentage : null;
      const overall =
        typeof overallValue === 'number'
          ? overallValue
          : summary.length
            ? summary.reduce((sum, item) => sum + item.attendance_percentage, 0) / summary.length
            : null;
      return { summary, records, overall };
    },
  });

export const useAttendanceRecords = (params: AttendanceListParams, enabled = true) =>
  useQuery({
    queryKey: queryKeys.academics.attendance(params as QueryParams),
    queryFn: () => attendanceApi.list(params),
    enabled,
    placeholderData: keepPreviousData,
    select: (result) => result.data,
  });

const useInvalidateAttendance = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.academics.attendanceAll });
};

export const useMarkAttendanceBatch = () => {
  const invalidate = useInvalidateAttendance();
  return useMutation({
    mutationFn: (records: MarkAttendancePayload[]) => Promise.all(records.map((record) => attendanceApi.mark(record))),
    meta: { successMessage: 'Attendance saved', errorTitle: 'Could not save attendance' },
    onSuccess: invalidate,
  });
};

export const useUpdateAttendance = () => {
  const invalidate = useInvalidateAttendance();
  return useMutation({
    mutationFn: attendanceApi.update,
    meta: { successMessage: 'Attendance updated', errorTitle: 'Could not update attendance' },
    onSuccess: invalidate,
  });
};

export const useDeleteAttendance = () => {
  const invalidate = useInvalidateAttendance();
  return useMutation({
    mutationFn: attendanceApi.remove,
    meta: { successMessage: 'Attendance record removed' },
    onSuccess: invalidate,
  });
};

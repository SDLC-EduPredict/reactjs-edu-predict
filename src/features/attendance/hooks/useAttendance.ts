import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/queryKeys';
import type { QueryParams } from '@/types';
import { attendanceApi } from '../api/attendanceApi';
import type { AttendanceListParams } from '../types';

export const useMyAttendance = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.studentPortal.attendance,
    enabled,
    queryFn: attendanceApi.mine,
    select: (result) => result.data.courses,
  });

export const useAttendanceRecords = (params: AttendanceListParams) =>
  useQuery({
    queryKey: queryKeys.attendance.list(params as QueryParams),
    queryFn: () => attendanceApi.list(params),
    placeholderData: keepPreviousData,
    select: (result) => result.data,
  });

export const useAttendanceSummary = (courseId: number | null) =>
  useQuery({
    queryKey: queryKeys.attendance.summary(courseId ?? 0),
    queryFn: () => attendanceApi.summary(courseId ?? 0),
    enabled: courseId !== null,
    select: (result) => result.data,
  });

export const useAttendanceRecord = (id: number | null) =>
  useQuery({
    queryKey: queryKeys.attendance.detail(id ?? 0),
    queryFn: () => attendanceApi.detail(id ?? 0),
    enabled: id !== null,
    select: (result) => result.data.attendance,
  });

const useInvalidate = () => {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.performance.all }),
    ]);
};

export const useMarkAttendance = () => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: attendanceApi.mark,
    meta: { successMessage: 'Attendance saved', errorTitle: 'Could not save attendance' },
    onSuccess: invalidate,
  });
};

export const useUpdateAttendance = () => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: attendanceApi.update,
    meta: { successMessage: 'Attendance updated', errorTitle: 'Could not update attendance' },
    onSuccess: invalidate,
  });
};

export const useDeleteAttendance = () => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: attendanceApi.remove,
    meta: { successMessage: 'Attendance record deleted', errorTitle: 'Could not delete record' },
    onSuccess: invalidate,
  });
};

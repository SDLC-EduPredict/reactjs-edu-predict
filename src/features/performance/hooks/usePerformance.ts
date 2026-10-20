import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { asCount, asList } from '@/lib/api/normalize';
import { queryKeys } from '@/lib/query/queryKeys';
import type { QueryParams } from '@/types';
import { performanceApi } from '../api/performanceApi';
import type { MonitoredStudent, MonitoredStudentListParams, PerformanceSnapshot } from '../types';

export const useMyPerformance = () =>
  useQuery({
    queryKey: queryKeys.studentPortal.performance,
    queryFn: performanceApi.mine,
    select: (result) => asList<PerformanceSnapshot>(result.data, ['performance', 'performances', 'courses']),
  });

export const useMonitoredStudents = (params: MonitoredStudentListParams) =>
  useQuery({
    queryKey: queryKeys.facultyPortal.students(params as QueryParams),
    queryFn: () => performanceApi.monitoredStudents(params),
    placeholderData: keepPreviousData,
    select: (result) => ({
      rows: asList<MonitoredStudent>(result.data, ['students']),
      count: asCount(result.data, ['students']),
    }),
  });

export const useStudentReport = (studentId: number | null) =>
  useQuery({
    queryKey: queryKeys.facultyPortal.student(studentId ?? 0),
    queryFn: () => performanceApi.studentReport(studentId ?? 0),
    enabled: studentId !== null,
    select: (result) => result.data,
  });

export const useCourseRoster = (courseId: string) => {
  const query = useMonitoredStudents({ course: courseId, page: 1, page_size: 200 });
  return { ...query, enabled: Boolean(courseId) };
};

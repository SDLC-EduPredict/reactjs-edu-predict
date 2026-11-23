import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/queryKeys';
import type { ListParams, QueryParams } from '@/types';
import { analyticsApi } from '../api/analyticsApi';
import type { FacultyStudentListParams } from '../types';

export const useFacultyDashboard = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.facultyPortal.dashboard,
    queryFn: analyticsApi.facultyDashboard,
    enabled,
    select: (result) => result.data,
  });

export const useFacultyStudents = (params: FacultyStudentListParams, enabled = true) =>
  useQuery({
    queryKey: queryKeys.facultyPortal.students(params as QueryParams),
    queryFn: () => analyticsApi.facultyStudents(params),
    enabled,
    placeholderData: keepPreviousData,
    select: (result) => result.data,
  });

export const useFacultyStudent = (studentId: number | null) =>
  useQuery({
    queryKey: queryKeys.facultyPortal.student(studentId ?? 0),
    queryFn: () => analyticsApi.facultyStudent(studentId ?? 0),
    enabled: studentId !== null,
    select: (result) => result.data,
  });

export const useAdminDashboard = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.admin.dashboard,
    enabled,
    queryFn: analyticsApi.adminDashboard,
    select: (result) => result.data,
  });

export const useReportOverview = () =>
  useQuery({ queryKey: queryKeys.reports.overview, queryFn: analyticsApi.overview, select: (result) => result.data });

export const useCoursePerformanceReport = () =>
  useQuery({
    queryKey: queryKeys.reports.coursePerformance,
    queryFn: analyticsApi.coursePerformance,
    select: (result) => result.data,
  });

export const useStudentsNeedingAttention = (params: ListParams) =>
  useQuery({
    queryKey: queryKeys.reports.studentsNeedingAttention(params as QueryParams),
    queryFn: () => analyticsApi.studentsNeedingAttention(params),
    placeholderData: keepPreviousData,
    select: (result) => result.data,
  });

export const usePredictionDistribution = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.reports.predictionDistribution,
    queryFn: analyticsApi.predictionDistribution,
    enabled,
    select: (result) => result.data,
  });

export const useExportReport = () =>
  useMutation({
    mutationFn: (report: 'course-performance' | 'students-needing-attention') =>
      report === 'course-performance'
        ? analyticsApi.exportCoursePerformance()
        : analyticsApi.exportStudentsNeedingAttention(),
    meta: { successMessage: 'Report downloaded', errorTitle: 'Export failed' },
  });

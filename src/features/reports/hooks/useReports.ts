import { useMutation, useQuery } from '@tanstack/react-query';
import { asList, isRecord, numericEntries } from '@/lib/api/normalize';
import { queryKeys } from '@/lib/query/queryKeys';
import type { CourseSummaryRow, IndicatorCount } from '@/features/dashboard/types';
import type { MonitoredStudent } from '@/features/performance/types';
import { reportsApi } from '../api/reportsApi';

export const useReportOverview = () =>
  useQuery({
    queryKey: queryKeys.reports.overview,
    queryFn: reportsApi.overview,
    select: (result) => {
      const data = result.data;
      const nested = isRecord(data) && isRecord(data.overview) ? data.overview : data;
      return numericEntries(nested);
    },
  });

export const useCoursePerformanceReport = () =>
  useQuery({
    queryKey: queryKeys.reports.coursePerformance,
    queryFn: reportsApi.coursePerformance,
    select: (result) => asList<CourseSummaryRow>(result.data, ['courses', 'rows']),
  });

export const useStudentsNeedingAttention = () =>
  useQuery({
    queryKey: queryKeys.reports.studentsNeedingAttention,
    queryFn: reportsApi.studentsNeedingAttention,
    select: (result) => asList<MonitoredStudent>(result.data, ['students', 'rows']),
  });

export const usePredictionDistribution = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.reports.predictionDistribution,
    enabled,
    queryFn: reportsApi.predictionDistribution,
    select: (result) => asList<IndicatorCount>(result.data, ['distribution', 'indicators']),
  });

export const useExportReport = () =>
  useMutation({
    mutationFn: (report: 'course-performance' | 'students-needing-attention') =>
      report === 'course-performance'
        ? reportsApi.exportCoursePerformance()
        : reportsApi.exportStudentsNeedingAttention(),
    meta: { successMessage: 'Report downloaded', errorTitle: 'Export failed' },
  });

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/queryKeys';
import type { QueryParams } from '@/types';
import { performanceApi } from '../api/performanceApi';
import type { PerformanceListParams } from '../types';

export const useMyPerformance = () =>
  useQuery({
    queryKey: queryKeys.studentPortal.performance,
    queryFn: performanceApi.mine,
    select: (result) => result.data,
  });

export const usePerformanceList = (params: PerformanceListParams, enabled = true) =>
  useQuery({
    queryKey: queryKeys.performance.list(params as QueryParams),
    queryFn: () => performanceApi.list(params),
    enabled,
    placeholderData: keepPreviousData,
    select: (result) => result.data,
  });

export const usePerformanceSummary = (courseId: number | null) =>
  useQuery({
    queryKey: queryKeys.performance.summary(courseId ?? 0),
    queryFn: () => performanceApi.summary(courseId ?? 0),
    enabled: courseId !== null,
    select: (result) => result.data,
  });

export const usePerformanceDataset = (courseId: number | null, enabled = true) =>
  useQuery({
    queryKey: queryKeys.performance.dataset(courseId ?? 'all'),
    queryFn: () => performanceApi.dataset(courseId),
    enabled,
    select: (result) => result.data,
  });

export const usePerformanceRecord = (id: number | null) =>
  useQuery({
    queryKey: queryKeys.performance.detail(id ?? 0),
    queryFn: () => performanceApi.detail(id ?? 0),
    enabled: id !== null,
    select: (result) => result.data.performance,
  });

export const useUpdatePerformance = (silent = false) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: performanceApi.update,
    meta: silent ? { silent: true } : { successMessage: 'Performance updated', errorTitle: 'Could not update performance' },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.performance.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.ml.all }),
      ]),
  });
};

export const useExportDataset = () =>
  useMutation({
    mutationFn: performanceApi.exportDataset,
    meta: { successMessage: 'Dataset downloaded', errorTitle: 'Export failed' },
  });

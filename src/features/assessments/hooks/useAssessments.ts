import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/queryKeys';
import type { QueryParams } from '@/types';
import { assessmentsApi } from '../api/assessmentsApi';
import type { AssessmentListParams } from '../types';

export const useMyResults = () =>
  useQuery({
    queryKey: queryKeys.studentPortal.results,
    queryFn: assessmentsApi.myResults,
    select: (result) => result.data.courses,
  });

export const useAssessments = (params: AssessmentListParams, enabled = true) =>
  useQuery({
    queryKey: queryKeys.assessments.list(params as QueryParams),
    queryFn: () => assessmentsApi.list(params),
    enabled,
    placeholderData: keepPreviousData,
    select: (result) => result.data,
  });

export const useAssessment = (id: number | null) =>
  useQuery({
    queryKey: queryKeys.assessments.detail(id ?? 0),
    queryFn: () => assessmentsApi.detail(id ?? 0),
    enabled: id !== null,
    select: (result) => result.data.assessment,
  });

export const useAssessmentResults = (id: number | null) =>
  useQuery({
    queryKey: queryKeys.assessments.results(id ?? 0),
    queryFn: () => assessmentsApi.results(id ?? 0),
    enabled: id !== null,
    select: (result) => result.data,
  });

const useInvalidate = () => {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.assessments.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.performance.all }),
    ]);
};

export const useCreateAssessment = () => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: assessmentsApi.create,
    meta: { successMessage: 'Assessment created', errorTitle: 'Could not create assessment' },
    onSuccess: invalidate,
  });
};

export const useUpdateAssessment = () => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: assessmentsApi.update,
    meta: { successMessage: 'Assessment updated', errorTitle: 'Could not update assessment' },
    onSuccess: invalidate,
  });
};

export const useDeleteAssessment = () => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: assessmentsApi.remove,
    meta: { successMessage: 'Assessment deleted', errorTitle: 'Could not delete assessment' },
    onSuccess: invalidate,
  });
};

export const useEnterMarks = () => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: assessmentsApi.enterMarks,
    meta: { successMessage: 'Marks saved', errorTitle: 'Could not save marks' },
    onSuccess: invalidate,
  });
};

export const useDeleteResult = () => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: assessmentsApi.deleteResult,
    meta: { successMessage: 'Result deleted', errorTitle: 'Could not delete result' },
    onSuccess: invalidate,
  });
};

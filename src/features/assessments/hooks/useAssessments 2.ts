import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { asList } from '@/lib/api/normalize';
import { queryKeys } from '@/lib/query/queryKeys';
import type { QueryParams } from '@/types';
import { assessmentsApi } from '../api/assessmentsApi';
import type { AssessmentListParams, AssessmentResult } from '../types';

export const useMyResults = (params: QueryParams = {}) =>
  useQuery({
    queryKey: queryKeys.studentPortal.results(params),
    queryFn: () => assessmentsApi.myResults(params),
    select: (result) => asList<AssessmentResult>(result.data, ['results']),
  });

export const useAssessments = (params: AssessmentListParams) =>
  useQuery({
    queryKey: queryKeys.academics.assessments(params as QueryParams),
    queryFn: () => assessmentsApi.list(params),
    placeholderData: keepPreviousData,
    select: (result) => result.data,
  });

const useInvalidateAssessments = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.academics.assessmentsAll });
};

export const useCreateAssessment = () => {
  const invalidate = useInvalidateAssessments();
  return useMutation({
    mutationFn: assessmentsApi.create,
    meta: { successMessage: 'Assessment scheduled', errorTitle: 'Could not create assessment' },
    onSuccess: invalidate,
  });
};

export const useUpdateAssessment = () => {
  const invalidate = useInvalidateAssessments();
  return useMutation({
    mutationFn: assessmentsApi.update,
    meta: { successMessage: 'Assessment updated', errorTitle: 'Could not update assessment' },
    onSuccess: invalidate,
  });
};

export const useDeleteAssessment = () => {
  const invalidate = useInvalidateAssessments();
  return useMutation({
    mutationFn: assessmentsApi.remove,
    meta: { successMessage: 'Assessment deleted', errorTitle: 'Could not delete assessment' },
    onSuccess: invalidate,
  });
};

export const useAssessmentResults = (assessmentId: number | null) =>
  useQuery({
    queryKey: queryKeys.academics.assessmentResults(assessmentId ?? 0),
    queryFn: () => assessmentsApi.results(assessmentId ?? 0),
    enabled: assessmentId !== null,
    select: (result) => asList<AssessmentResult>(result.data, ['results']),
  });

export const useRecordResult = (assessmentId: number | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assessmentsApi.recordResult,
    meta: { successMessage: 'Marks recorded', errorTitle: 'Could not record marks' },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.academics.assessmentResults(assessmentId ?? 0) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.academics.assessmentsAll }),
      ]),
  });
};

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { asList } from '@/lib/api/normalize';
import { queryKeys } from '@/lib/query/queryKeys';
import type { QueryParams } from '@/types';
import { assignmentsApi } from '../api/assignmentsApi';
import type { Assignment, AssignmentListParams, Submission } from '../types';

export const useMyAssignments = (params: QueryParams = {}) =>
  useQuery({
    queryKey: queryKeys.studentPortal.assignments(params),
    queryFn: () => assignmentsApi.mine(params),
    select: (result) => asList<Assignment>(result.data, ['assignments']),
  });

export const useSubmitAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignmentsApi.submit,
    meta: { successMessage: 'Assignment submitted', errorTitle: 'Could not submit assignment' },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.studentPortal.all }),
  });
};

export const useAssignments = (params: AssignmentListParams) =>
  useQuery({
    queryKey: queryKeys.academics.assignments(params as QueryParams),
    queryFn: () => assignmentsApi.list(params),
    placeholderData: keepPreviousData,
    select: (result) => result.data,
  });

const useInvalidateAssignments = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.academics.assignmentsAll });
};

export const useCreateAssignment = () => {
  const invalidate = useInvalidateAssignments();
  return useMutation({
    mutationFn: assignmentsApi.create,
    meta: { successMessage: 'Assignment created', errorTitle: 'Could not create assignment' },
    onSuccess: invalidate,
  });
};

export const useUpdateAssignment = () => {
  const invalidate = useInvalidateAssignments();
  return useMutation({
    mutationFn: assignmentsApi.update,
    meta: { successMessage: 'Assignment updated', errorTitle: 'Could not update assignment' },
    onSuccess: invalidate,
  });
};

export const useDeleteAssignment = () => {
  const invalidate = useInvalidateAssignments();
  return useMutation({
    mutationFn: assignmentsApi.remove,
    meta: { successMessage: 'Assignment deleted', errorTitle: 'Could not delete assignment' },
    onSuccess: invalidate,
  });
};

export const useSubmissions = (assignmentId: number | null) =>
  useQuery({
    queryKey: queryKeys.academics.submissions(assignmentId ?? 0),
    queryFn: () => assignmentsApi.submissions(assignmentId ?? 0),
    enabled: assignmentId !== null,
    select: (result) => asList<Submission>(result.data, ['submissions']),
  });

export const useGradeSubmission = (assignmentId: number | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignmentsApi.grade,
    meta: { successMessage: 'Marks saved', errorTitle: 'Could not save marks' },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.academics.submissions(assignmentId ?? 0) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.academics.assignmentsAll }),
      ]),
  });
};

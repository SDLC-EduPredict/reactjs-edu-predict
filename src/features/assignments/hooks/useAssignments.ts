import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/queryKeys';
import type { QueryParams } from '@/types';
import { assignmentsApi } from '../api/assignmentsApi';
import type { AssignmentListParams } from '../types';

export const useMyAssignments = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.studentPortal.assignments,
    enabled,
    queryFn: assignmentsApi.mine,
    select: (result) => result.data.courses,
  });

export const useSubmitAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignmentsApi.submit,
    meta: { successMessage: 'Assignment submitted', errorTitle: 'Could not submit assignment' },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.studentPortal.all }),
  });
};

export const useAssignments = (params: AssignmentListParams, enabled = true) =>
  useQuery({
    queryKey: queryKeys.assignments.list(params as QueryParams),
    queryFn: () => assignmentsApi.list(params),
    enabled,
    placeholderData: keepPreviousData,
    select: (result) => result.data,
  });

export const useAssignment = (id: number | null) =>
  useQuery({
    queryKey: queryKeys.assignments.detail(id ?? 0),
    queryFn: () => assignmentsApi.detail(id ?? 0),
    enabled: id !== null,
    select: (result) => result.data.assignment,
  });

export const useSubmissions = (id: number | null) =>
  useQuery({
    queryKey: queryKeys.assignments.submissions(id ?? 0),
    queryFn: () => assignmentsApi.submissions(id ?? 0),
    enabled: id !== null,
    select: (result) => result.data,
  });

const useInvalidate = () => {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.performance.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.facultyPortal.dashboard }),
    ]);
};

export const useCreateAssignment = () => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: assignmentsApi.create,
    meta: { successMessage: 'Assignment created', errorTitle: 'Could not create assignment' },
    onSuccess: invalidate,
  });
};

export const useUpdateAssignment = () => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: assignmentsApi.update,
    meta: { successMessage: 'Assignment updated', errorTitle: 'Could not update assignment' },
    onSuccess: invalidate,
  });
};

export const useDeleteAssignment = () => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: assignmentsApi.remove,
    meta: { successMessage: 'Assignment deleted', errorTitle: 'Could not delete assignment' },
    onSuccess: invalidate,
  });
};

export const useGradeSubmissions = () => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: assignmentsApi.grade,
    meta: { successMessage: 'Grade saved', errorTitle: 'Could not save grade' },
    onSuccess: invalidate,
  });
};

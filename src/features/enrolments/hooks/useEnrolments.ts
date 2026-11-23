import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/queryKeys';
import type { QueryParams } from '@/types';
import { enrolmentsApi } from '../api/enrolmentsApi';
import type { EnrolmentListParams } from '../types';

export const useMyCourses = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.studentPortal.courses,
    queryFn: enrolmentsApi.myCourses,
    enabled,
    select: (result) => result.data.courses,
  });

export const useMyCourse = (id: number | null) =>
  useQuery({
    queryKey: queryKeys.studentPortal.course(id ?? 0),
    queryFn: () => enrolmentsApi.myCourse(id ?? 0),
    enabled: id !== null,
    select: (result) => result.data.enrolment,
  });

export const useEnrol = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: enrolmentsApi.enrol,
    meta: { successMessage: 'You are enrolled!', errorTitle: 'Could not enrol' },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.studentPortal.all }),
  });
};

export const useEnrolments = (params: EnrolmentListParams, enabled = true) =>
  useQuery({
    queryKey: queryKeys.enrolments.list(params as QueryParams),
    queryFn: () => enrolmentsApi.list(params),
    enabled,
    placeholderData: keepPreviousData,
    select: (result) => result.data,
  });

export const useEnrolment = (id: number | null) =>
  useQuery({
    queryKey: queryKeys.enrolments.detail(id ?? 0),
    queryFn: () => enrolmentsApi.detail(id ?? 0),
    enabled: id !== null,
    select: (result) => result.data.enrolment,
  });

const useInvalidate = () => {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.enrolments.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
    ]);
};

export const useCreateEnrolment = () => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: enrolmentsApi.create,
    meta: { successMessage: 'Enrolment created', errorTitle: 'Could not create enrolment' },
    onSuccess: invalidate,
  });
};

export const useUpdateEnrolment = () => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: enrolmentsApi.update,
    meta: { successMessage: 'Enrolment updated', errorTitle: 'Could not update enrolment' },
    onSuccess: invalidate,
  });
};

export const useDeleteEnrolment = () => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: enrolmentsApi.remove,
    meta: { successMessage: 'Enrolment deleted', errorTitle: 'Could not delete enrolment' },
    onSuccess: invalidate,
  });
};

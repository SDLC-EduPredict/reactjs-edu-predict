import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { asList } from '@/lib/api/normalize';
import { queryKeys } from '@/lib/query/queryKeys';
import type { QueryParams } from '@/types';
import { enrolmentsApi } from '../api/enrolmentsApi';
import type { Enrolment, EnrolmentListParams } from '../types';

export const useMyEnrolments = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.studentPortal.courses,
    queryFn: enrolmentsApi.myCourses,
    enabled,
    select: (result) => asList<Enrolment>(result.data, ['enrolments', 'courses']),
  });

export const useEnrol = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: enrolmentsApi.enrol,
    meta: { successMessage: 'Enrolment request submitted', errorTitle: 'Could not enrol' },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.studentPortal.all }),
  });
};

export const useAdminEnrolments = (params: EnrolmentListParams) =>
  useQuery({
    queryKey: queryKeys.admin.enrolments(params as QueryParams),
    queryFn: () => enrolmentsApi.adminList(params),
    placeholderData: keepPreviousData,
    select: (result) => result.data,
  });

const useInvalidateEnrolments = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.enrolmentsAll });
};

export const useAdminCreateEnrolment = () => {
  const invalidate = useInvalidateEnrolments();
  return useMutation({
    mutationFn: enrolmentsApi.adminCreate,
    meta: { successMessage: 'Student enrolled', errorTitle: 'Could not enrol student' },
    onSuccess: invalidate,
  });
};

export const useAdminUpdateEnrolment = () => {
  const invalidate = useInvalidateEnrolments();
  return useMutation({
    mutationFn: enrolmentsApi.adminUpdate,
    meta: { successMessage: 'Enrolment updated', errorTitle: 'Could not update enrolment' },
    onSuccess: invalidate,
  });
};

export const useAdminRemoveEnrolment = () => {
  const invalidate = useInvalidateEnrolments();
  return useMutation({
    mutationFn: enrolmentsApi.adminRemove,
    meta: { successMessage: 'Enrolment removed', errorTitle: 'Could not remove enrolment' },
    onSuccess: invalidate,
  });
};

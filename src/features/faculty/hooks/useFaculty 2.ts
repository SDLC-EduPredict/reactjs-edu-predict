import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/queryKeys';
import type { ListParams, QueryParams } from '@/types';
import { facultyApi } from '../api/facultyApi';
import type { FacultyListParams } from '../types';

export const usePublicFaculty = (params: ListParams) =>
  useQuery({
    queryKey: queryKeys.catalog.faculty(params as QueryParams),
    queryFn: () => facultyApi.publicList(params),
    placeholderData: keepPreviousData,
    select: (result) => result.data,
  });

export const usePublicFacultyMember = (id: string | undefined) =>
  useQuery({
    queryKey: queryKeys.catalog.facultyMember(id ?? ''),
    queryFn: () => facultyApi.publicDetail(id ?? ''),
    enabled: Boolean(id),
    select: (result) => result.data,
  });

export const useFacultyProfile = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.facultyPortal.profile,
    queryFn: facultyApi.profile,
    enabled,
    select: (result) => result.data.profile,
  });

export const useUpdateFacultyProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: facultyApi.updateProfile,
    meta: { successMessage: 'Faculty profile updated', errorTitle: 'Could not update faculty profile' },
    onSuccess: (result) => {
      queryClient.setQueryData(queryKeys.facultyPortal.profile, result);
      return queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
};

export const useAdminFaculty = (params: FacultyListParams) =>
  useQuery({
    queryKey: queryKeys.admin.faculty(params as QueryParams),
    queryFn: () => facultyApi.adminList(params),
    placeholderData: keepPreviousData,
    select: (result) => result.data,
  });

const useFacultyInvalidation = () => {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.facultyAll }),
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.all }),
    ]);
};

export const useCreateFaculty = () => {
  const invalidate = useFacultyInvalidation();
  return useMutation({
    mutationFn: facultyApi.create,
    meta: { successMessage: 'Faculty member created', errorTitle: 'Could not create faculty member' },
    onSuccess: invalidate,
  });
};

export const useUpdateFaculty = () => {
  const invalidate = useFacultyInvalidation();
  return useMutation({
    mutationFn: facultyApi.update,
    meta: { successMessage: 'Faculty member updated', errorTitle: 'Could not update faculty member' },
    onSuccess: invalidate,
  });
};

export const useDeactivateFaculty = () => {
  const invalidate = useFacultyInvalidation();
  return useMutation({
    mutationFn: facultyApi.deactivate,
    meta: { successMessage: 'Faculty member deactivated', errorTitle: 'Could not deactivate faculty member' },
    onSuccess: invalidate,
  });
};

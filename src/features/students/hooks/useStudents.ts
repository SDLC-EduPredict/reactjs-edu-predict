import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/queryKeys';
import type { QueryParams } from '@/types';
import { studentsApi } from '../api/studentsApi';
import type { StudentListParams } from '../types';

export const useOwnStudentProfile = () =>
  useQuery({
    queryKey: queryKeys.studentPortal.profile,
    queryFn: studentsApi.ownProfile,
    select: (result) => result.data.profile,
  });

export const useUpdateOwnStudentProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: studentsApi.updateOwnProfile,
    meta: { successMessage: 'Profile saved', errorTitle: 'Could not save profile' },
    onSuccess: (result) => {
      queryClient.setQueryData(queryKeys.studentPortal.profile, result);
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.studentPortal.dashboard }),
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.me }),
      ]);
    },
  });
};

export const useStudentDashboard = () =>
  useQuery({
    queryKey: queryKeys.studentPortal.dashboard,
    queryFn: studentsApi.dashboard,
    select: (result) => result.data,
  });

export const useAdminStudents = (params: StudentListParams, enabled = true) =>
  useQuery({
    queryKey: queryKeys.admin.students(params as QueryParams),
    queryFn: () => studentsApi.adminList(params),
    enabled,
    placeholderData: keepPreviousData,
    select: (result) => result.data,
  });

export const useAdminStudent = (id: number | null) =>
  useQuery({
    queryKey: queryKeys.admin.student(id ?? 0),
    queryFn: () => studentsApi.adminDetail(id ?? 0),
    enabled: id !== null,
    select: (result) => result.data.profile,
  });

const useInvalidateStudents = () => {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.studentsAll }),
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
    ]);
};

export const useCreateStudent = () => {
  const invalidate = useInvalidateStudents();
  return useMutation({
    mutationFn: studentsApi.create,
    meta: { successMessage: 'Student created', errorTitle: 'Could not create student' },
    onSuccess: invalidate,
  });
};

export const useUpdateStudent = () => {
  const invalidate = useInvalidateStudents();
  return useMutation({
    mutationFn: studentsApi.update,
    meta: { successMessage: 'Student updated', errorTitle: 'Could not update student' },
    onSuccess: invalidate,
  });
};

export const useDeactivateStudent = () => {
  const invalidate = useInvalidateStudents();
  return useMutation({
    mutationFn: studentsApi.deactivate,
    meta: { successMessage: 'Student deactivated', errorTitle: 'Could not deactivate student' },
    onSuccess: invalidate,
  });
};

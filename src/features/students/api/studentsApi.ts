import { ENDPOINTS } from '@/lib/api/endpoints';
import { api, toFormData } from '@/lib/api/request';
import type { Paginated, QueryParams } from '@/types';
import type {
  CreateStudentPayload,
  StudentDashboardData,
  StudentListParams,
  StudentProfile,
  StudentProfileData,
  UpdateOwnProfilePayload,
  UpdateStudentPayload,
} from '../types';

export const studentsApi = {
  ownProfile: () => api.get<StudentProfileData>(ENDPOINTS.student.profile),
  updateOwnProfile: (payload: UpdateOwnProfilePayload) =>
    api.patch<StudentProfileData>(
      ENDPOINTS.student.profile,
      payload.photo instanceof File ? toFormData({ ...payload }) : { ...payload, photo: undefined },
    ),
  dashboard: () => api.get<StudentDashboardData>(ENDPOINTS.student.dashboard),
  adminList: (params: StudentListParams) =>
    api.get<Paginated<StudentProfile>>(ENDPOINTS.admin.students, params as QueryParams),
  adminDetail: (id: number) => api.get<StudentProfileData>(ENDPOINTS.admin.student(id)),
  create: (payload: CreateStudentPayload) =>
    api.post<StudentProfileData, CreateStudentPayload>(ENDPOINTS.admin.students, payload),
  update: ({ id, ...payload }: UpdateStudentPayload & { id: number }) =>
    api.patch<StudentProfileData, UpdateStudentPayload>(ENDPOINTS.admin.student(id), payload),
  deactivate: (id: number) => api.delete(ENDPOINTS.admin.student(id)),
};

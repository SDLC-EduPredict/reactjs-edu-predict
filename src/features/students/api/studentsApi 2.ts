import { ENDPOINTS } from '@/lib/api/endpoints';
import { api, toFormData } from '@/lib/api/request';
import type { Paginated, QueryParams } from '@/types';
import type {
  AdminStudentData,
  CreateStudentPayload,
  StudentListParams,
  StudentProfile,
  StudentProfileData,
  UpdateOwnStudentProfilePayload,
  UpdateStudentPayload,
} from '../types';

export const studentsApi = {
  ownProfile: () => api.get<StudentProfileData>(ENDPOINTS.student.profile),
  updateOwnProfile: (payload: UpdateOwnStudentProfilePayload) => {
    const { photo, ...rest } = payload;
    return api.patch<StudentProfileData>(
      ENDPOINTS.student.profile,
      photo instanceof File ? toFormData({ ...rest, photo }) : rest,
    );
  },
  adminList: (params: StudentListParams) =>
    api.get<Paginated<StudentProfile>>(ENDPOINTS.admin.students, params as QueryParams),
  adminDetail: (id: number) => api.get<AdminStudentData>(ENDPOINTS.admin.student(id)),
  create: (payload: CreateStudentPayload) =>
    api.post<AdminStudentData, CreateStudentPayload>(ENDPOINTS.admin.students, payload),
  update: ({ id, ...payload }: UpdateStudentPayload & { id: number }) =>
    api.patch<AdminStudentData, UpdateStudentPayload>(ENDPOINTS.admin.student(id), payload),
  deactivate: (id: number) => api.delete(ENDPOINTS.admin.student(id)),
};

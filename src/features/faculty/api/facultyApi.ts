import { ENDPOINTS } from '@/lib/api/endpoints';
import { api, toFormData } from '@/lib/api/request';
import type { ListParams, Paginated, QueryParams } from '@/types';
import type {
  AdminFaculty,
  CreateFacultyPayload,
  FacultyListParams,
  FacultyProfile,
  PublicFaculty,
  PublicFacultyDetailData,
  UpdateFacultyPayload,
} from '../types';

const asMultipart = (payload: UpdateFacultyPayload) => toFormData({ ...payload });

export const facultyApi = {
  publicList: (params: ListParams) => api.get<Paginated<PublicFaculty>>(ENDPOINTS.catalog.faculty, params as QueryParams),
  publicDetail: (id: string) => api.get<PublicFacultyDetailData>(ENDPOINTS.catalog.facultyMember(id)),
  profile: () => api.get<{ profile: FacultyProfile }>(ENDPOINTS.faculty.profile),
  updateProfile: (payload: UpdateFacultyPayload) =>
    api.patch<{ profile: FacultyProfile }>(ENDPOINTS.faculty.profile, asMultipart(payload)),
  adminList: (params: FacultyListParams) =>
    api.get<Paginated<AdminFaculty>>(ENDPOINTS.admin.faculty, params as QueryParams),
  adminDetail: (id: number) => api.get<{ faculty: AdminFaculty }>(ENDPOINTS.admin.facultyMember(id)),
  create: (payload: CreateFacultyPayload) =>
    api.post<{ faculty: AdminFaculty }, CreateFacultyPayload>(ENDPOINTS.admin.faculty, payload),
  update: ({ id, ...payload }: UpdateFacultyPayload & { id: number }) =>
    api.patch<{ faculty: AdminFaculty }>(ENDPOINTS.admin.facultyMember(id), asMultipart(payload)),
  deactivate: (id: number) => api.delete(ENDPOINTS.admin.facultyMember(id)),
};

import { ENDPOINTS } from '@/lib/api/endpoints';
import { api } from '@/lib/api/request';
import { withBase64Image } from '@/lib/utils/image';
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

const withPhoto = (payload: UpdateFacultyPayload | CreateFacultyPayload) => withBase64Image(payload, 'photo');

export const facultyApi = {
  publicList: (params: ListParams) => api.get<Paginated<PublicFaculty>>(ENDPOINTS.catalog.faculty, params as QueryParams),
  publicDetail: (id: string) => api.get<PublicFacultyDetailData>(ENDPOINTS.catalog.facultyMember(id)),
  profile: () => api.get<{ profile: FacultyProfile }>(ENDPOINTS.faculty.profile),
  updateProfile: async (payload: UpdateFacultyPayload) =>
    api.patch<{ profile: FacultyProfile }>(ENDPOINTS.faculty.profile, await withPhoto(payload)),
  adminList: (params: FacultyListParams) =>
    api.get<Paginated<AdminFaculty>>(ENDPOINTS.admin.faculty, params as QueryParams),
  adminDetail: (id: number) => api.get<{ faculty: AdminFaculty }>(ENDPOINTS.admin.facultyMember(id)),
  create: async (payload: CreateFacultyPayload) =>
    api.post<{ faculty: AdminFaculty }>(ENDPOINTS.admin.faculty, await withPhoto(payload)),
  update: async ({ id, ...payload }: UpdateFacultyPayload & { id: number }) =>
    api.patch<{ faculty: AdminFaculty }>(ENDPOINTS.admin.facultyMember(id), await withPhoto(payload)),
  deactivate: (id: number) => api.delete(ENDPOINTS.admin.facultyMember(id)),
};

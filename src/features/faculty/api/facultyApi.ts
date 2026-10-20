import { ENDPOINTS } from '@/lib/api/endpoints';
import { api, toFormData } from '@/lib/api/request';
import type { ListParams, Paginated, QueryParams } from '@/types';
import type {
  AdminFaculty,
  AdminFacultyData,
  CreateFacultyPayload,
  FacultyListParams,
  FacultyProfileData,
  PublicFaculty,
  PublicFacultyDetailData,
  UpdateFacultyPayload,
  UpdateFacultyProfilePayload,
} from '../types';

const hasFile = (payload: { photo?: File | null }) => payload.photo instanceof File;

export const facultyApi = {
  publicList: (params: ListParams) =>
    api.get<Paginated<PublicFaculty>>(ENDPOINTS.catalog.faculty, params as QueryParams),
  publicDetail: (id: string) => api.get<PublicFacultyDetailData>(ENDPOINTS.catalog.facultyMember(id)),
  profile: () => api.get<FacultyProfileData>(ENDPOINTS.faculty.profile),
  updateProfile: (payload: UpdateFacultyProfilePayload) => {
    const { photo, ...rest } = payload;
    return api.patch<FacultyProfileData>(
      ENDPOINTS.faculty.profile,
      hasFile(payload) ? toFormData({ ...rest, photo }) : rest,
    );
  },
  adminList: (params: FacultyListParams) =>
    api.get<Paginated<AdminFaculty>>(ENDPOINTS.admin.faculty, params as QueryParams),
  adminDetail: (id: number) => api.get<AdminFacultyData>(ENDPOINTS.admin.facultyMember(id)),
  create: (payload: CreateFacultyPayload) =>
    api.post<AdminFacultyData, CreateFacultyPayload>(ENDPOINTS.admin.faculty, payload),
  update: ({ id, ...payload }: UpdateFacultyPayload & { id: number }) => {
    const { photo, ...rest } = payload;
    return api.patch<AdminFacultyData>(
      ENDPOINTS.admin.facultyMember(id),
      hasFile(payload) ? toFormData({ ...rest, photo }) : rest,
    );
  },
  deactivate: (id: number) => api.delete(ENDPOINTS.admin.facultyMember(id)),
};

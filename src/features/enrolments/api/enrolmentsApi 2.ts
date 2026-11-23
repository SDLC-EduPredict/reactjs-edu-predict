import { ENDPOINTS } from '@/lib/api/endpoints';
import { api } from '@/lib/api/request';
import type { Paginated, QueryParams } from '@/types';
import type {
  AdminCreateEnrolmentPayload,
  EnrolPayload,
  Enrolment,
  EnrolmentData,
  EnrolmentListParams,
  UpdateEnrolmentPayload,
} from '../types';

export const enrolmentsApi = {
  myCourses: () => api.get<unknown>(ENDPOINTS.student.courses),
  enrol: (payload: EnrolPayload) => api.post<EnrolmentData, EnrolPayload>(ENDPOINTS.student.enrol, payload),
  adminList: (params: EnrolmentListParams) =>
    api.get<Paginated<Enrolment>>(ENDPOINTS.admin.enrolments, params as QueryParams),
  adminCreate: (payload: AdminCreateEnrolmentPayload) =>
    api.post<EnrolmentData, AdminCreateEnrolmentPayload>(ENDPOINTS.admin.enrolments, payload),
  adminUpdate: ({ id, ...payload }: UpdateEnrolmentPayload & { id: number }) =>
    api.patch<EnrolmentData, UpdateEnrolmentPayload>(ENDPOINTS.admin.enrolment(id), payload),
  adminRemove: (id: number) => api.delete(ENDPOINTS.admin.enrolment(id)),
};

import { ENDPOINTS } from '@/lib/api/endpoints';
import { api } from '@/lib/api/request';
import type { EnrolmentStatus, Paginated, QueryParams } from '@/types';
import type { CreateEnrolmentPayload, Enrolment, EnrolmentListParams, StudentEnrolment } from '../types';

export const enrolmentsApi = {
  myCourses: () => api.get<{ courses: StudentEnrolment[] }>(ENDPOINTS.student.courses),
  myCourse: (id: number) => api.get<{ enrolment: StudentEnrolment }>(ENDPOINTS.student.course(id)),
  enrol: (courseId: number) =>
    api.post<{ enrolment: StudentEnrolment }>(ENDPOINTS.student.courses, { course: String(courseId) }),
  list: (params: EnrolmentListParams) => api.get<Paginated<Enrolment>>(ENDPOINTS.enrolments.list, params as QueryParams),
  detail: (id: number) => api.get<{ enrolment: Enrolment }>(ENDPOINTS.enrolments.detail(id)),
  create: (payload: CreateEnrolmentPayload) =>
    api.post<{ enrolment: Enrolment }, CreateEnrolmentPayload>(ENDPOINTS.enrolments.list, payload),
  update: ({ id, status }: { id: number; status: EnrolmentStatus }) =>
    api.patch<{ enrolment: Enrolment }>(ENDPOINTS.enrolments.detail(id), { status }),
  remove: (id: number) => api.delete(ENDPOINTS.enrolments.detail(id)),
};

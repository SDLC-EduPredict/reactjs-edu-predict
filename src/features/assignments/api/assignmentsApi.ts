import { ENDPOINTS } from '@/lib/api/endpoints';
import { api, toFormData } from '@/lib/api/request';
import type { Paginated, QueryParams } from '@/types';
import type {
  Assignment,
  AssignmentListParams,
  AssignmentPayload,
  GradePayload,
  StudentAssignmentsCourse,
  SubmissionsData,
  Submission,
  SubmitPayload,
} from '../types';

export const assignmentsApi = {
  mine: () => api.get<{ courses: StudentAssignmentsCourse[] }>(ENDPOINTS.student.assignments),
  submit: ({ assignmentId, ...payload }: SubmitPayload & { assignmentId: number }) =>
    api.post<{ submission: Submission }>(
      ENDPOINTS.student.submitAssignment(assignmentId),
      payload.submission_file
        ? toFormData({ ...payload })
        : { submission_text: payload.submission_text, submission_link: payload.submission_link },
    ),
  list: (params: AssignmentListParams) =>
    api.get<Paginated<Assignment>>(ENDPOINTS.assignments.list, params as QueryParams),
  detail: (id: number) => api.get<{ assignment: Assignment }>(ENDPOINTS.assignments.detail(id)),
  create: (payload: AssignmentPayload) =>
    api.post<{ assignment: Assignment }, AssignmentPayload>(ENDPOINTS.assignments.list, payload),
  update: ({ id, ...payload }: Partial<AssignmentPayload> & { id: number }) =>
    api.patch<{ assignment: Assignment }>(ENDPOINTS.assignments.detail(id), payload),
  remove: (id: number) => api.delete(ENDPOINTS.assignments.detail(id)),
  submissions: (id: number) => api.get<SubmissionsData>(ENDPOINTS.assignments.submissions(id)),
  grade: ({ id, ...payload }: GradePayload & { id: number }) =>
    api.post<{ submissions: Submission[] }, GradePayload>(ENDPOINTS.assignments.submissions(id), payload),
};

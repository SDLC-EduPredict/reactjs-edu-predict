import { ENDPOINTS } from '@/lib/api/endpoints';
import { api, toFormData } from '@/lib/api/request';
import type { Paginated, QueryParams } from '@/types';
import type {
  Assignment,
  AssignmentListParams,
  AssignmentPayload,
  GradeSubmissionPayload,
  SubmitAssignmentPayload,
  Submission,
} from '../types';

export const assignmentsApi = {
  mine: (params: QueryParams) => api.get<unknown>(ENDPOINTS.student.assignments, params),
  submit: ({ assignmentId, ...payload }: SubmitAssignmentPayload & { assignmentId: number }) =>
    api.post<{ submission: Submission }>(
      ENDPOINTS.student.submitAssignment(assignmentId),
      payload.file instanceof File ? toFormData(payload) : { submission_text: payload.submission_text },
    ),
  list: (params: AssignmentListParams) =>
    api.get<Paginated<Assignment>>(ENDPOINTS.academics.assignments, params as QueryParams),
  create: (payload: AssignmentPayload) =>
    api.post<{ assignment: Assignment }, AssignmentPayload>(ENDPOINTS.academics.assignments, payload),
  update: ({ id, ...payload }: Partial<AssignmentPayload> & { id: number }) =>
    api.patch<{ assignment: Assignment }>(ENDPOINTS.academics.assignment(id), payload),
  remove: (id: number) => api.delete(ENDPOINTS.academics.assignment(id)),
  submissions: (assignmentId: number) => api.get<unknown>(ENDPOINTS.academics.assignmentSubmissions(assignmentId)),
  grade: ({ id, ...payload }: GradeSubmissionPayload & { id: number }) =>
    api.post<{ submission: Submission }, GradeSubmissionPayload>(ENDPOINTS.academics.gradeSubmission(id), payload),
};

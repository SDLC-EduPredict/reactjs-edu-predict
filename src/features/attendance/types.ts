import type { CourseRef, ListParams, StudentRef } from '@/types';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export const ATTENDANCE_STATUSES: { value: AttendanceStatus; label: string }[] = [
  { value: 'PRESENT', label: 'Present' },
  { value: 'ABSENT', label: 'Absent' },
  { value: 'LATE', label: 'Late' },
  { value: 'EXCUSED', label: 'Excused' },
];

export interface AttendanceRecord {
  id: number;
  enrolment?: number;
  student?: StudentRef;
  course?: CourseRef;
  session_date: string;
  session_topic?: string | null;
  status: AttendanceStatus | (string & {});
  status_display?: string;
  remarks?: string | null;
  marked_by?: { id: string; full_name: string } | null;
  created_at?: string;
}

export interface AttendanceSummary {
  course: CourseRef;
  total_sessions: number;
  present: number;
  absent: number;
  late?: number;
  excused?: number;
  attendance_percentage: number;
}

export interface AttendanceListParams extends ListParams {
  course?: string;
  session_date?: string;
  status?: string;
  student?: string;
}

export interface MarkAttendancePayload {
  enrolment: number;
  session_date: string;
  session_topic?: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface UpdateAttendancePayload {
  status?: AttendanceStatus;
  remarks?: string;
}

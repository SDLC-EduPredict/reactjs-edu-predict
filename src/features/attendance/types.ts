import type { AttendanceProgress, CourseRef, ListParams, StudentRef } from '@/types';

export type AttendanceStatus = 'PRESENT' | 'LATE' | 'ABSENT';

export const ATTENDANCE_STATUSES: { value: AttendanceStatus; label: string }[] = [
  { value: 'PRESENT', label: 'Present' },
  { value: 'LATE', label: 'Late' },
  { value: 'ABSENT', label: 'Absent' },
];

export interface AttendanceRecord {
  id: number;
  enrolment: number;
  student: StudentRef;
  course: CourseRef;
  date: string;
  status: AttendanceStatus | (string & {});
  status_display: string;
  remarks: string;
  marked_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudentAttendanceCourse {
  enrolment_id: number;
  course: CourseRef;
  summary: AttendanceProgress;
  records: { id: number; date: string; status: AttendanceStatus | (string & {}); status_display: string; remarks: string }[];
}

export interface AttendanceSummaryData {
  course: CourseRef;
  students: ({ enrolment_id: number; student: StudentRef } & AttendanceProgress)[];
}

export interface AttendanceListParams extends ListParams {
  course?: string;
  date?: string;
  status?: string;
}

export interface MarkAttendancePayload {
  date: string;
  records: { enrolment: number; status: AttendanceStatus; remarks?: string }[];
}

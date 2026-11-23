import type { CourseRef, ListParams, UserRole } from '@/types';

export const NOTIFICATION_TYPES = [
  { value: 'COURSE', label: 'Course' },
  { value: 'ASSIGNMENT', label: 'Assignment' },
  { value: 'ASSESSMENT', label: 'Assessment' },
  { value: 'ACADEMIC_ALERT', label: 'Academic Alert' },
  { value: 'ADMINISTRATIVE', label: 'Administrative' },
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number]['value'];

export const NOTIFICATION_AUDIENCES = [
  { value: 'ALL', label: 'Everyone' },
  { value: 'STUDENTS', label: 'All students' },
  { value: 'FACULTY', label: 'All faculty' },
  { value: 'COURSE', label: 'Students of a course' },
  { value: 'USER', label: 'A single user' },
] as const;

export type NotificationAudience = (typeof NOTIFICATION_AUDIENCES)[number]['value'];

export interface AppNotification {
  id: number;
  notification_type: NotificationType | (string & {});
  notification_type_display: string;
  title: string;
  message: string;
  course: CourseRef | null;
  sent_by: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface AdminNotification extends AppNotification {
  recipient: { id: string; full_name: string; email: string; role: UserRole | (string & {}) };
}

export interface NotificationListParams extends ListParams {
  is_read?: string;
  notification_type?: string;
  course?: string;
}

export interface AdminNotificationListParams extends NotificationListParams {
  recipient?: string;
}

export interface SendNotificationPayload {
  audience: NotificationAudience;
  notification_type?: NotificationType;
  title: string;
  message: string;
  course?: number;
  user?: string;
}

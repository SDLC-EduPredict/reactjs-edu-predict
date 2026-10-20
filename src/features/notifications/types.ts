import type { CourseRef, ListParams, Paginated } from '@/types';

export const NOTIFICATION_TYPES = [
  { value: 'COURSE', label: 'Course' },
  { value: 'ASSIGNMENT', label: 'Assignment' },
  { value: 'ASSESSMENT', label: 'Assessment' },
  { value: 'ACADEMIC_ALERT', label: 'Academic alert' },
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
  title: string;
  message: string;
  notification_type: NotificationType | (string & {});
  notification_type_display?: string;
  course?: CourseRef | null;
  link?: string | null;
  is_read: boolean;
  read_at?: string | null;
  created_at: string;
}

export interface NotificationList extends Paginated<AppNotification> {
  unread_count?: number;
}

export interface NotificationListParams extends ListParams {
  is_read?: string;
  notification_type?: string;
  course?: string;
}

export interface UnreadCountData {
  unread_count: number;
}

export interface BroadcastNotification {
  id: number;
  title: string;
  message: string;
  notification_type: NotificationType | (string & {});
  notification_type_display?: string;
  audience: NotificationAudience | (string & {});
  audience_display?: string;
  course?: CourseRef | null;
  recipient_count?: number;
  created_by?: { id: string; full_name: string } | null;
  created_at: string;
}

export interface BroadcastPayload {
  title: string;
  message: string;
  notification_type: NotificationType;
  audience: NotificationAudience;
  course?: number;
  user?: string;
}

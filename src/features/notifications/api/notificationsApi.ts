import { ENDPOINTS } from '@/lib/api/endpoints';
import { api } from '@/lib/api/request';
import type { Paginated, QueryParams } from '@/types';
import type {
  AdminNotification,
  AdminNotificationListParams,
  AppNotification,
  NotificationListParams,
  SendNotificationPayload,
} from '../types';

export const notificationsApi = {
  list: (params: NotificationListParams) =>
    api.get<Paginated<AppNotification> & { unread_count: number }>(ENDPOINTS.notifications.list, params as QueryParams),
  unreadCount: () => api.get<{ unread_count: number }>(ENDPOINTS.notifications.unreadCount),
  readAll: () => api.post<{ updated: number; unread_count: number }>(ENDPOINTS.notifications.readAll),
  detail: (id: number) => api.get<{ notification: AppNotification }>(ENDPOINTS.notifications.detail(id)),
  remove: (id: number) => api.delete<{ unread_count: number }>(ENDPOINTS.notifications.detail(id)),
  markRead: (id: number) =>
    api.post<{ notification: AppNotification; unread_count: number }>(ENDPOINTS.notifications.read(id)),
  adminList: (params: AdminNotificationListParams) =>
    api.get<Paginated<AdminNotification>>(ENDPOINTS.admin.notifications, params as QueryParams),
  send: (payload: SendNotificationPayload) =>
    api.post<{ recipients: number }, SendNotificationPayload>(ENDPOINTS.admin.notifications, payload),
  adminRemove: (id: number) => api.delete(ENDPOINTS.admin.notification(id)),
};

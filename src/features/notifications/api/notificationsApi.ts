import { ENDPOINTS } from '@/lib/api/endpoints';
import { api } from '@/lib/api/request';
import type { Paginated, QueryParams } from '@/types';
import type {
  BroadcastNotification,
  BroadcastPayload,
  NotificationList,
  NotificationListParams,
  UnreadCountData,
} from '../types';

export const notificationsApi = {
  list: (params: NotificationListParams) =>
    api.get<NotificationList>(ENDPOINTS.notifications.list, params as QueryParams),
  unreadCount: () => api.get<UnreadCountData>(ENDPOINTS.notifications.unreadCount),
  markRead: (id: number) => api.post<null>(ENDPOINTS.notifications.read(id)),
  markAllRead: () => api.post<null>(ENDPOINTS.notifications.readAll),
  remove: (id: number) => api.delete(ENDPOINTS.notifications.detail(id)),
  adminList: (params: QueryParams) =>
    api.get<Paginated<BroadcastNotification>>(ENDPOINTS.admin.notifications, params),
  broadcast: (payload: BroadcastPayload) =>
    api.post<{ notification: BroadcastNotification }, BroadcastPayload>(ENDPOINTS.admin.notifications, payload),
  adminRemove: (id: number) => api.delete(ENDPOINTS.admin.notification(id)),
};

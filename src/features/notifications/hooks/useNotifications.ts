import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { env } from '@/config/env';
import { useAppSelector } from '@/app/store/hooks';
import { selectIsAuthenticated } from '@/features/auth/store/selectors';
import { queryKeys } from '@/lib/query/queryKeys';
import type { QueryParams } from '@/types';
import { notificationsApi } from '../api/notificationsApi';
import type { AdminNotificationListParams, NotificationListParams } from '../types';

export const useNotifications = (params: NotificationListParams) =>
  useQuery({
    queryKey: queryKeys.notifications.list(params as QueryParams),
    queryFn: () => notificationsApi.list(params),
    placeholderData: keepPreviousData,
    select: (result) => result.data,
  });

export const useNotification = (id: number | null) =>
  useQuery({
    queryKey: queryKeys.notifications.detail(id ?? 0),
    queryFn: () => notificationsApi.detail(id ?? 0),
    enabled: id !== null,
    select: (result) => result.data.notification,
  });

export const useUnreadCount = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount,
    queryFn: notificationsApi.unreadCount,
    enabled: isAuthenticated,
    refetchInterval: env.notificationPollIntervalMs,
    select: (result) => result.data.unread_count,
  });
};

const useInvalidate = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
};

export const useMarkRead = () => {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: notificationsApi.markRead, meta: { silent: true }, onSuccess: invalidate });
};

export const useReadAll = () => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: notificationsApi.readAll,
    meta: { successMessage: 'All notifications marked as read' },
    onSuccess: invalidate,
  });
};

export const useDeleteNotification = () => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: notificationsApi.remove,
    meta: { successMessage: 'Notification deleted' },
    onSuccess: invalidate,
  });
};

export const useAdminNotifications = (params: AdminNotificationListParams, enabled = true) =>
  useQuery({
    queryKey: queryKeys.admin.notifications(params as QueryParams),
    queryFn: () => notificationsApi.adminList(params),
    enabled,
    placeholderData: keepPreviousData,
    select: (result) => result.data,
  });

export const useSendNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.send,
    meta: { errorTitle: 'Could not send notification' },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.notificationsAll }),
  });
};

export const useDeleteAdminNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.adminRemove,
    meta: { successMessage: 'Notification deleted', errorTitle: 'Could not delete notification' },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.notificationsAll }),
  });
};

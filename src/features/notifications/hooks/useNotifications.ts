import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { env } from '@/config/env';
import { useAppSelector } from '@/app/store/hooks';
import { selectIsAuthenticated } from '@/features/auth/store/selectors';
import { queryKeys } from '@/lib/query/queryKeys';
import type { QueryParams } from '@/types';
import { notificationsApi } from '../api/notificationsApi';
import type { NotificationListParams } from '../types';

export const useNotifications = (params: NotificationListParams) =>
  useQuery({
    queryKey: queryKeys.notifications.list(params as QueryParams),
    queryFn: () => notificationsApi.list(params),
    placeholderData: keepPreviousData,
    select: (result) => result.data,
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

const useInvalidateNotifications = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
};

export const useMarkNotificationRead = () => {
  const invalidate = useInvalidateNotifications();
  return useMutation({ mutationFn: notificationsApi.markRead, meta: { silent: true }, onSuccess: invalidate });
};

export const useMarkAllNotificationsRead = () => {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: notificationsApi.markAllRead,
    meta: { successMessage: 'All notifications marked as read' },
    onSuccess: invalidate,
  });
};

export const useDeleteNotification = () => {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: notificationsApi.remove,
    meta: { successMessage: 'Notification removed' },
    onSuccess: invalidate,
  });
};

export const useAdminNotifications = (params: QueryParams, enabled = true) =>
  useQuery({
    queryKey: queryKeys.admin.notifications(params),
    enabled,
    queryFn: () => notificationsApi.adminList(params),
    placeholderData: keepPreviousData,
    select: (result) => result.data,
  });

export const useBroadcastNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.broadcast,
    meta: { successMessage: 'Notification sent', errorTitle: 'Could not send notification' },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.notificationsAll }),
  });
};

export const useDeleteBroadcast = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.adminRemove,
    meta: { successMessage: 'Notification deleted' },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.notificationsAll }),
  });
};

import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { env } from '@/config/env';
import { store } from '@/app/store/store';
import { toastAdded } from '@/app/store/slices/uiSlice';
import { ApiError, getErrorMessage } from '@/lib/api/apiError';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError;
    mutationMeta: {
      successMessage?: string;
      errorTitle?: string;
      silent?: boolean;
    };
    queryMeta: {
      errorTitle?: string;
    };
  }
}

const shouldRetry = (failureCount: number, error: unknown): boolean => {
  if (error instanceof ApiError && error.statusCode >= 400 && error.statusCode < 500) return false;
  return failureCount < env.queryRetryCount;
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.meta?.errorTitle) {
        store.dispatch(
          toastAdded({ type: 'error', title: query.meta.errorTitle, message: getErrorMessage(error) }),
        );
      }
    },
  }),
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      const message = mutation.meta?.successMessage;
      if (message && !mutation.meta?.silent) {
        store.dispatch(toastAdded({ type: 'success', title: message }));
      }
    },
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.silent) return;
      store.dispatch(
        toastAdded({
          type: 'error',
          title: mutation.meta?.errorTitle ?? 'Request failed',
          message: getErrorMessage(error),
        }),
      );
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: env.queryStaleTimeMs,
      retry: shouldRetry,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

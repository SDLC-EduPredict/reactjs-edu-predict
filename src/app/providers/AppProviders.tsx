import { lazy, Suspense, type ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { env } from '@/config/env';
import { store } from '@/app/store/store';
import { queryClient } from '@/lib/query/queryClient';
import { injectStore } from '@/lib/api/httpClient';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';

injectStore(store);

const QueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((module) => ({ default: module.ReactQueryDevtools })),
);

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary>
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        {import.meta.env.DEV && env.enableQueryDevtools && (
          <Suspense fallback={null}>
            <QueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
          </Suspense>
        )}
      </QueryClientProvider>
    </ReduxProvider>
  </ErrorBoundary>
);

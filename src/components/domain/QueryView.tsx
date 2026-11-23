import type { ReactNode } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import { ErrorState, Skeleton } from '@/components/ui';
import { getErrorMessage } from '@/lib/api/apiError';

interface QueryViewProps<T> {
  query: UseQueryResult<T>;
  children: (data: T) => ReactNode;
  loading?: ReactNode;
}

/** Renders loading, error and success states for a TanStack query in one place. */
export const QueryView = <T,>({ query, children, loading }: QueryViewProps<T>) => {
  if (query.isPending) {
    return (
      <>
        {loading ?? (
          <div className="space-y-4">
            <Skeleton className="h-28 w-full rounded-3xl" />
            <Skeleton className="h-64 w-full rounded-3xl" />
          </div>
        )}
      </>
    );
  }
  if (query.isError) return <ErrorState message={getErrorMessage(query.error)} onRetry={() => void query.refetch()} />;
  return <>{children(query.data)}</>;
};

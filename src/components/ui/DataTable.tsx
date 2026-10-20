import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { EmptyState, ErrorState, Skeleton } from './Feedback';

export interface Column<T> {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[] | undefined;
  rowKey: (row: T) => string | number;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  onRowClick?: (row: T) => void;
}

export const DataTable = <T,>({
  columns,
  rows,
  rowKey,
  loading,
  error,
  onRetry,
  emptyTitle = 'No records found',
  emptyDescription,
  emptyAction,
  onRowClick,
}: DataTableProps<T>) => {
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!loading && (!rows || rows.length === 0)) {
    return <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />;
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
        <thead className="bg-slate-50/80">
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className={cn('whitespace-nowrap px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500', column.headerClassName)}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {loading
            ? Array.from({ length: 5 }, (_, index) => (
                <tr key={`skeleton-${index}`}>
                  {columns.map((column) => (
                    <td key={column.key} className="px-5 py-4">
                      <Skeleton className="h-4 w-full max-w-[160px]" />
                    </td>
                  ))}
                </tr>
              ))
            : rows?.map((row) => (
                <tr
                  key={rowKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn('transition-colors hover:bg-brand-50/40', onRowClick && 'cursor-pointer')}
                >
                  {columns.map((column) => (
                    <td key={column.key} className={cn('px-5 py-3.5 align-middle text-slate-700', column.className)}>
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

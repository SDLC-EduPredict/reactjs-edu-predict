import type { ReactNode } from 'react';
import { AlertTriangle, Inbox, Loader2, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from './Button';

export const Spinner = ({ className, label }: { className?: string; label?: string }) => (
  <div className={cn('flex items-center justify-center gap-2 text-sm text-slate-500', className)} role="status">
    <Loader2 className="h-5 w-5 animate-spin text-brand-600" />
    {label && <span>{label}</span>}
  </div>
);

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('skeleton-shimmer animate-shimmer rounded-xl', className)} />
);

export const PageLoader = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <Spinner label="Loading…" />
  </div>
);

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export const EmptyState = ({ title, description, icon, action, className }: EmptyStateProps) => (
  <div className={cn('flex flex-col items-center justify-center px-6 py-14 text-center', className)}>
    <div className="mb-4 rounded-2xl bg-brand-50 p-3 text-brand-500">{icon ?? <Inbox className="h-6 w-6" />}</div>
    <h3 className="text-sm font-bold text-slate-900">{title}</h3>
    {description && <p className="mt-1 max-w-sm text-xs text-slate-500">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState = ({ message, onRetry, className }: ErrorStateProps) => (
  <div className={cn('flex flex-col items-center justify-center px-6 py-14 text-center', className)}>
    <div className="mb-4 rounded-2xl bg-rose-50 p-3 text-rose-500">
      <AlertTriangle className="h-6 w-6" />
    </div>
    <h3 className="text-sm font-bold text-slate-900">We couldn't load this data</h3>
    <p className="mt-1 max-w-md text-xs text-slate-500">{message ?? 'Please try again in a moment.'}</p>
    {onRetry && (
      <Button variant="outline" size="sm" className="mt-5" icon={<RefreshCcw className="h-3.5 w-3.5" />} onClick={onRetry}>
        Try again
      </Button>
    )}
  </div>
);

export const Alert = ({ tone = 'info', title, children }: { tone?: 'info' | 'warning' | 'error' | 'success'; title?: string; children?: ReactNode }) => {
  const styles = {
    info: 'border-brand-200 bg-brand-50 text-brand-800',
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
    error: 'border-rose-200 bg-rose-50 text-rose-800',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  }[tone];
  return (
    <div className={cn('rounded-xl border px-4 py-3 text-xs', styles)} role="alert">
      {title && <p className="font-bold">{title}</p>}
      {children && <div className={cn(title && 'mt-0.5')}>{children}</div>}
    </div>
  );
};

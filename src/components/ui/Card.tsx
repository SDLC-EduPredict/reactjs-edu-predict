import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export const Card = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('rounded-3xl border border-slate-200/70 bg-white shadow-card', className)} {...rest} />
);

interface CardHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export const CardHeader = ({ title, description, action, icon, className }: CardHeaderProps) => (
  <div className={cn('flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4', className)}>
    <div className="flex items-start gap-3">
      {icon && <div className="rounded-xl bg-brand-50 p-2 text-brand-600">{icon}</div>}
      <div>
        <h3 className="font-display text-base font-semibold text-slate-900">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      </div>
    </div>
    {action}
  </div>
);

export const CardBody = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-5', className)} {...rest} />
);

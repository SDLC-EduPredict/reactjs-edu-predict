import type { ReactNode } from 'react';
import { CountUp } from '@/components/motion/CountUp';
import { useInView } from '@/lib/hooks/useInView';
import { cn } from '@/lib/utils/cn';
import { formatNumber } from '@/lib/utils/format';

export const fmtScore = (value: number | null | undefined, digits = 1) =>
  typeof value === 'number' && Number.isFinite(value) ? formatNumber(value, digits) : '—';

export const fmtPct = (value: number | null | undefined, digits = 0) =>
  typeof value === 'number' && Number.isFinite(value) ? `${value.toFixed(digits)}%` : '—';

interface MeterProps {
  label: string;
  value: number | null | undefined;
  max?: number;
  suffix?: string;
  dark?: boolean;
}

export const Meter = ({ label, value, max = 100, suffix = `/ ${max}`, dark }: MeterProps) => {
  const [ref, inView] = useInView<HTMLDivElement>();
  const ratio = typeof value === 'number' && inView ? Math.max(0, Math.min(1, value / max)) : 0;
  return (
    <div ref={ref}>
      <div className={cn('mb-1.5 flex justify-between text-xs font-semibold', dark ? 'text-white/80' : 'text-slate-600')}>
        <span>{label}</span>
        <span className={dark ? 'text-lime-brand' : 'text-slate-900'}>
          {typeof value === 'number' ? `${formatNumber(value, value % 1 ? 1 : 0)} ${suffix}` : 'No data'}
        </span>
      </div>
      <div className={cn('relative h-2 rounded-full', dark ? 'bg-white/15' : 'bg-slate-100')}>
        <div
          className={cn('h-full rounded-full transition-[width] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]', dark ? 'bg-lime-brand' : 'bg-brand-700')}
          style={{ width: `${ratio * 100}%` }}
        />
        {dark && typeof value === 'number' && (
          <span
            className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-sun-400 transition-[left] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ left: `${ratio * 100}%` }}
          />
        )}
      </div>
    </div>
  );
};

interface KpiProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  hint?: ReactNode;
  tone?: 'navy' | 'lime' | 'sun' | 'rose' | 'lavender';
}

const kpiTones = {
  navy: 'bg-brand-700 text-white',
  lime: 'bg-lime-soft text-lime-ink',
  sun: 'bg-sun-100 text-amber-700',
  rose: 'bg-rose-50 text-rose-600',
  lavender: 'bg-brand-50 text-brand-700',
};

export const Kpi = ({ label, value, icon, hint, tone = 'lavender' }: KpiProps) => (
  <div className="group rounded-2xl border border-slate-200/70 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift">
    <div className="flex items-start justify-between gap-3">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
      {icon && (
        <span className={cn('flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110', kpiTones[tone])}>{icon}</span>
      )}
    </div>
    <p className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900">
      {typeof value === 'string' || typeof value === 'number' ? <CountUp value={value} /> : value}
    </p>
    {hint && <div className="mt-1.5 text-xs text-slate-500">{hint}</div>}
  </div>
);

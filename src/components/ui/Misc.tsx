import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Search } from 'lucide-react';
import { useInView } from '@/lib/hooks/useInView';
import { cn } from '@/lib/utils/cn';
import { initials, resolveMediaUrl } from '@/lib/utils/format';

interface AvatarProps {
  name?: string | null;
  src?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const avatarSizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-base', xl: 'h-20 w-20 text-xl' };

export const Avatar = ({ name, src, size = 'md', className }: AvatarProps) => {
  const url = resolveMediaUrl(src);
  return url ? (
    <img src={url} alt={name ?? 'Avatar'} className={cn('shrink-0 rounded-full object-cover ring-1 ring-slate-200', avatarSizes[size], className)} />
  ) : (
    <span className={cn('inline-flex shrink-0 items-center justify-center rounded-full bg-brand-700 font-bold text-white', avatarSizes[size], className)}>
      {initials(name)}
    </span>
  );
};

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  eyebrow?: string;
}

export const PageHeader = ({ title, description, actions, eyebrow }: PageHeaderProps) => (
  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      {eyebrow && <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-brand-600">{eyebrow}</p>}
      <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.7rem]">{title}</h1>
      {description && <p className="mt-1 max-w-2xl text-sm text-slate-500">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput = ({ value, onChange, placeholder = 'Search…', className }: SearchInputProps) => (
  <div className={cn('relative w-full sm:w-72', className)}>
    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
    />
  </div>
);

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  hint?: ReactNode;
  tone?: 'brand' | 'green' | 'amber' | 'rose' | 'violet' | 'sky';
}

const statTones = {
  brand: 'bg-brand-50 text-brand-600',
  green: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600',
  violet: 'bg-violet-50 text-violet-600',
  sky: 'bg-sky-50 text-sky-600',
};

export const StatCard = ({ label, value, icon, hint, tone = 'brand' }: StatCardProps) => (
  <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-semibold text-slate-500">{label}</p>
        <p className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      </div>
      {icon && <div className={cn('rounded-xl p-2.5', statTones[tone])}>{icon}</div>}
    </div>
    {hint && <div className="mt-3 text-xs text-slate-500">{hint}</div>}
  </div>
);

export const ProgressBar = ({ value, tone = 'brand', className }: { value: number; tone?: 'brand' | 'green' | 'amber' | 'rose'; className?: string }) => {
  const color = { brand: 'from-brand-600 to-brand-400', green: 'from-lime-brand to-emerald-500', amber: 'from-amber-400 to-orange-500', rose: 'from-rose-500 to-pink-500' }[tone];
  const [ref, inView] = useInView<HTMLDivElement>();
  const width = inView ? Math.max(0, Math.min(100, value)) : 0;
  return (
    <div ref={ref} className={cn('h-2 w-full overflow-hidden rounded-full bg-slate-100', className)}>
      <div className={cn('h-full rounded-full bg-gradient-to-r transition-[width] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]', color)} style={{ width: `${width}%` }} />
    </div>
  );
};

interface TabsProps<T extends string> {
  tabs: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (value: T) => void;
}

interface PillBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Segmented tabs with a navy pill that glides to the selected option. */
export const Tabs = <T extends string>({ tabs, value, onChange }: TabsProps<T>) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<PillBox | null>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const active = list.querySelector<HTMLElement>('[aria-selected="true"]');
        setPill(active ? { left: active.offsetLeft, top: active.offsetTop, width: active.offsetWidth, height: active.offsetHeight } : null);
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [value, tabs.length]);

  return (
    <div ref={listRef} role="tablist" className="relative inline-flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
      {pill && (
        <span
          aria-hidden="true"
          className="absolute rounded-full bg-brand-700 shadow-sm shadow-brand-700/30 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={pill}
        />
      )}
      {tabs.map((tab) => {
        const selected = value === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.value)}
            className={cn(
              'relative z-10 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors duration-200',
              selected ? cn('text-white', !pill && 'bg-brand-700 shadow-sm') : 'text-slate-500 hover:text-slate-800',
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn('ml-1.5 rounded-full px-1.5 text-[10px] transition-colors', selected ? 'bg-white/20' : 'bg-black/10')}>{tab.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

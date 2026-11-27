import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react';
import { useTheme, type ThemePreference } from '@/lib/theme/theme';
import { cn } from '@/lib/utils/cn';

const OPTIONS: { value: ThemePreference; label: string; icon: LucideIcon }[] = [
  { value: 'system', label: 'System', icon: Monitor },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
];

/** Three-way System / Light / Dark switch with a sliding thumb. */
export const ThemeToggle = ({ className, showLabels = false }: { className?: string; showLabels?: boolean }) => {
  const { preference, setPreference } = useTheme();
  const index = OPTIONS.findIndex((option) => option.value === preference);

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className={cn('relative grid grid-cols-3 rounded-full bg-slate-100 p-1 ring-1 ring-slate-200/70', className)}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-1 left-1 rounded-full shadow-sm ring-1 ring-black/5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          width: 'calc((100% - 0.5rem) / 3)',
          transform: `translateX(${index * 100}%)`,
          background: 'var(--toggle-thumb, #fff)',
        }}
      />
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const active = preference === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${label} theme`}
            title={`${label} theme`}
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              setPreference(value, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
            }}
            className={cn(
              'relative z-10 flex items-center justify-center gap-1.5 rounded-full text-xs font-semibold transition-colors duration-200',
              showLabels ? 'h-9 px-3' : 'h-7 w-8',
              active ? 'text-brand-700' : 'text-slate-500 hover:text-slate-800',
            )}
          >
            <Icon className={cn('h-4 w-4 transition-transform duration-300', active && 'scale-110', active && value === 'light' && 'rotate-45')} />
            {showLabels && label}
          </button>
        );
      })}
    </div>
  );
};

import { cn } from '@/lib/utils/cn';

interface ScoreGaugeProps {
  score: number | null | undefined;
  max?: number;
  label?: string;
  size?: number;
  className?: string;
  dark?: boolean;
}

const colorFor = (ratio: number) => (ratio >= 0.75 ? '#9fd356' : ratio >= 0.6 ? '#f6c445' : '#f43f5e');

export const ScoreGauge = ({ score, max = 100, label = 'Predicted score', size = 180, className, dark }: ScoreGaugeProps) => {
  const value = typeof score === 'number' && Number.isFinite(score) ? Math.max(0, Math.min(max, score)) : null;
  const radius = 70;
  const circumference = Math.PI * radius;
  const ratio = value === null ? 0 : value / max;
  return (
    <div className={cn('flex flex-col items-center', className)} style={{ width: size }}>
      <svg viewBox="0 0 180 110" width={size} height={(size * 110) / 180} role="img" aria-label={`${label}: ${value ?? 'not available'}`}>
        <path d="M20 95 A70 70 0 0 1 160 95" fill="none" style={{ stroke: dark ? 'rgba(255,255,255,0.15)' : 'var(--color-slate-200)' }} strokeWidth="14" strokeLinecap="round" />
        <path
          d="M20 95 A70 70 0 0 1 160 95"
          fill="none"
          stroke={colorFor(ratio)}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
          style={{ transition: 'stroke-dashoffset 700ms ease' }}
        />
        <text x="90" y="82" textAnchor="middle" style={{ fill: dark ? '#ffffff' : 'var(--color-slate-900)', fontSize: 30, fontWeight: 700, fontFamily: 'Roboto Slab, serif' }}>
          {value === null ? '—' : value.toFixed(1)}
        </text>
        <text x="90" y="102" textAnchor="middle" style={{ fill: dark ? 'rgba(255,255,255,0.6)' : 'var(--color-slate-400)', fontSize: 11, fontWeight: 600 }}>
          / {max}
        </text>
      </svg>
      <p className={cn('mt-1 text-xs font-semibold', dark ? 'text-white/70' : 'text-slate-500')}>{label}</p>
    </div>
  );
};

import { cn } from '@/lib/utils/cn';

interface ScoreGaugeProps {
  score: number | null | undefined;
  max?: number;
  label?: string;
  size?: number;
  className?: string;
}

const colorFor = (ratio: number) => (ratio >= 0.75 ? '#10b981' : ratio >= 0.6 ? '#6366f1' : ratio >= 0.45 ? '#f59e0b' : '#f43f5e');

export const ScoreGauge = ({ score, max = 100, label = 'Predicted score', size = 180, className }: ScoreGaugeProps) => {
  const value = typeof score === 'number' && Number.isFinite(score) ? Math.max(0, Math.min(max, score)) : null;
  const radius = 70;
  const circumference = Math.PI * radius;
  const ratio = value === null ? 0 : value / max;
  return (
    <div className={cn('flex flex-col items-center', className)} style={{ width: size }}>
      <svg viewBox="0 0 180 110" width={size} height={(size * 110) / 180} role="img" aria-label={`${label}: ${value ?? 'not available'}`}>
        <path d="M20 95 A70 70 0 0 1 160 95" fill="none" stroke="#e2e8f0" strokeWidth="14" strokeLinecap="round" />
        <path
          d="M20 95 A70 70 0 0 1 160 95"
          fill="none"
          stroke={colorFor(ratio)}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
          style={{ transition: 'stroke-dashoffset 600ms ease' }}
        />
        <text x="90" y="82" textAnchor="middle" className="fill-slate-900" style={{ fontSize: 30, fontWeight: 800 }}>
          {value === null ? '—' : value.toFixed(1)}
        </text>
        <text x="90" y="102" textAnchor="middle" className="fill-slate-400" style={{ fontSize: 11, fontWeight: 600 }}>
          / {max}
        </text>
      </svg>
      <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
    </div>
  );
};

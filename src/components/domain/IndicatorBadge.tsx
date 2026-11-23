import { Badge, type BadgeTone } from '@/components/ui';
import { humanize } from '@/lib/utils/format';

const TONES: Record<string, BadgeTone> = {
  GOOD: 'lime',
  AVERAGE: 'sun',
  NEEDS_ATTENTION: 'rose',
  NO_DATA: 'slate',
};

const LABELS: Record<string, string> = {
  GOOD: 'Good',
  AVERAGE: 'Average Standing',
  NEEDS_ATTENTION: 'Needs Attention',
  NO_DATA: 'Not enough data',
};

export const IndicatorBadge = ({ indicator, label }: { indicator: string | null | undefined; label?: string | null }) => {
  if (!indicator) return <Badge tone="slate">No prediction</Badge>;
  const key = indicator.toUpperCase();
  return (
    <Badge tone={TONES[key] ?? 'slate'} icon={<span className="h-1.5 w-1.5 rounded-full bg-current" />}>
      {label || LABELS[key] || humanize(key)}
    </Badge>
  );
};

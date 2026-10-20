import { Badge, type BadgeTone } from '@/components/ui';
import { humanize } from '@/lib/utils/format';

const TONES: Record<string, BadgeTone> = {
  EXCELLENT: 'green',
  DISTINCTION: 'green',
  GOOD: 'brand',
  AVERAGE: 'amber',
  NEEDS_ATTENTION: 'rose',
};

export const IndicatorBadge = ({ indicator, label }: { indicator: string | null | undefined; label?: string }) => {
  if (!indicator) return <Badge tone="slate">Not available</Badge>;
  const key = indicator.toUpperCase().replace(/\s+/g, '_');
  return <Badge tone={TONES[key] ?? 'slate'}>{label || humanize(key)}</Badge>;
};

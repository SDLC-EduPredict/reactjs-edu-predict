import type { LucideIcon } from 'lucide-react';
import { BarChart3, BrainCircuit, Code2, Cpu, Database, Globe, Layers, LineChart, Server, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { resolveMediaUrl } from '@/lib/utils/format';

interface Theme {
  match: RegExp;
  icon: LucideIcon;
  from: string;
  to: string;
  accent: string;
}

const THEMES: Theme[] = [
  { match: /django|backend|api|rest/i, icon: Server, from: '#0f3d2e', to: '#14532d', accent: '#9fd356' },
  { match: /python/i, icon: Code2, from: '#14185a', to: '#1e2a78', accent: '#f6c445' },
  { match: /full ?stack|web|frontend|react|javascript/i, icon: Globe, from: '#1d1f86', to: '#2563eb', accent: '#93c5fd' },
  { match: /data science|analytics|tableau|business intelligence/i, icon: BarChart3, from: '#0b2447', to: '#19376d', accent: '#5eead4' },
  { match: /machine learning|\bml\b|regression/i, icon: LineChart, from: '#1e1b4b', to: '#3b0764', accent: '#c4b5fd' },
  { match: /artificial|\bai\b|deep learning|nlp|neural/i, icon: BrainCircuit, from: '#111827', to: '#1f2937', accent: '#67e8f9' },
  { match: /database|sql|postgres/i, icon: Database, from: '#172554', to: '#1e3a8a', accent: '#fde68a' },
  { match: /iot|embedded|hardware/i, icon: Cpu, from: '#1c1917', to: '#44403c', accent: '#fdba74' },
];

const fallback: Theme = { match: /.*/, icon: Layers, from: '#1a1f71', to: '#2d33a8', accent: '#f9d56e' };

export const themeFor = (text: string): Theme => THEMES.find((theme) => theme.match.test(text)) ?? fallback;

interface CourseArtProps {
  title: string;
  category?: string;
  thumbnail?: string | null;
  className?: string;
  compact?: boolean;
}

export const CourseArt = ({ title, category = '', thumbnail, className, compact }: CourseArtProps) => {
  const url = resolveMediaUrl(thumbnail);
  if (url) return <img src={url} alt={title} loading="lazy" className={cn('h-full w-full object-cover', className)} />;
  const theme = themeFor(`${title} ${category}`);
  const Icon = theme.icon;
  return (
    <div
      className={cn('relative flex h-full w-full items-center justify-center overflow-hidden', className)}
      style={{ background: `radial-gradient(circle at 70% 20%, ${theme.accent}33, transparent 55%), linear-gradient(140deg, ${theme.from}, ${theme.to})` }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 opacity-[0.18]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
      <div className="absolute -bottom-10 -right-6 h-36 w-36 rounded-full border border-white/10" />
      <div className="absolute -bottom-4 -right-2 h-24 w-24 rounded-full border border-white/10" />
      <div className={cn('relative flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur', compact ? 'h-12 w-12' : 'h-16 w-16')}>
        <Icon className={compact ? 'h-6 w-6' : 'h-8 w-8'} style={{ color: theme.accent }} />
      </div>
      {!compact && <Sparkles className="absolute left-5 top-5 h-4 w-4 text-white/40" />}
    </div>
  );
};

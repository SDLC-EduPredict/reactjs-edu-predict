import { MEDIA_BASE_URL } from '@/config/env';

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export const formatCurrency = (value: number | string | null | undefined): string => {
  const amount = Number(value);
  return Number.isFinite(amount) ? currency.format(amount) : '—';
};

export const formatDate = (value: string | null | undefined, withTime = false): string => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
};

export const formatRelative = (value: string | null | undefined): string => {
  if (!value) return '';
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} d ago`;
  return formatDate(value);
};

export const formatNumber = (value: number | null | undefined, digits = 1): string =>
  typeof value === 'number' && Number.isFinite(value) ? value.toFixed(digits) : '—';

export const formatPercent = (value: number | null | undefined, digits = 0): string =>
  typeof value === 'number' && Number.isFinite(value) ? `${value.toFixed(digits)}%` : '—';

export const resolveMediaUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:') || path.startsWith('blob:')) return path;
  return `${MEDIA_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const initials = (name: string | null | undefined): string =>
  (name ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'EP';

export const humanize = (value: string | null | undefined): string =>
  (value ?? '')
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

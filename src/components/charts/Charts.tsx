import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CHART_COLORS } from './chartColors';

const axisProps = { tick: { fontSize: 11, fill: '#64748b' }, axisLine: false, tickLine: false } as const;
const tooltipStyle = {
  borderRadius: 12,
  border: '1px solid var(--color-slate-200)',
  background: 'var(--surface, #fff)',
  color: 'var(--color-slate-800)',
  fontSize: 12,
} as const;

export interface SeriesDef {
  key: string;
  label: string;
  color?: string;
}

interface CartesianProps {
  data: Record<string, string | number | null>[];
  xKey: string;
  series: SeriesDef[];
  height?: number;
  domain?: [number, number];
}

export const SimpleBarChart = ({ data, xKey, series, height = 260, domain }: CartesianProps) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
      <XAxis dataKey={xKey} {...axisProps} interval={0} />
      <YAxis {...axisProps} domain={domain} />
      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--color-brand-50)' }} />
      {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
      {series.map((item, index) => (
        <Bar key={item.key} dataKey={item.key} name={item.label} fill={item.color ?? CHART_COLORS[index % CHART_COLORS.length]} radius={[8, 8, 0, 0]} maxBarSize={34} />
      ))}
    </BarChart>
  </ResponsiveContainer>
);

export const SimpleLineChart = ({ data, xKey, series, height = 260, domain }: CartesianProps) => (
  <ResponsiveContainer width="100%" height={height}>
    <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
      <XAxis dataKey={xKey} {...axisProps} />
      <YAxis {...axisProps} domain={domain} />
      <Tooltip contentStyle={tooltipStyle} />
      {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
      {series.map((item, index) => (
        <Line key={item.key} type="monotone" dataKey={item.key} name={item.label} stroke={item.color ?? CHART_COLORS[index % CHART_COLORS.length]} strokeWidth={2.5} dot={{ r: 3 }} />
      ))}
    </LineChart>
  </ResponsiveContainer>
);

export const DonutChart = ({ data, height = 240 }: { data: { name: string; value: number; color?: string }[]; height?: number }) => (
  <ResponsiveContainer width="100%" height={height}>
    <PieChart>
      <Pie data={data} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="85%" paddingAngle={3} stroke="none" isAnimationActive={false}>
        {data.map((entry, index) => (
          <Cell key={entry.name} fill={entry.color ?? CHART_COLORS[index % CHART_COLORS.length]} />
        ))}
      </Pie>
      <Tooltip contentStyle={tooltipStyle} />
      <Legend wrapperStyle={{ fontSize: 12 }} />
    </PieChart>
  </ResponsiveContainer>
);

export const FeatureRadar = ({ data, height = 280 }: { data: { feature: string; value: number }[]; height?: number }) => (
  <ResponsiveContainer width="100%" height={height}>
    <RadarChart data={data} outerRadius="72%">
      <PolarGrid stroke="#e2e8f0" />
      <PolarAngleAxis dataKey="feature" tick={{ fontSize: 11, fill: '#475569' }} />
      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
      <Radar dataKey="value" stroke="#1a1f71" fill="#6f6bc9" fillOpacity={0.25} strokeWidth={2} />
      <Tooltip contentStyle={tooltipStyle} />
    </RadarChart>
  </ResponsiveContainer>
);

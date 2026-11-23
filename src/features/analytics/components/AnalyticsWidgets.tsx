import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Card, CardBody, CardHeader, EmptyState } from '@/components/ui';
import { DonutChart, SimpleBarChart } from '@/components/charts/Charts';
import { INDICATOR_COLORS } from '@/components/charts/chartColors';
import { IndicatorBadge } from '@/components/domain/IndicatorBadge';
import { fmtPct, fmtScore } from '@/components/domain/Metric';
import { formatDate, humanize } from '@/lib/utils/format';
import type { AttentionRow, CourseAnalyticsRow, IndicatorCounts, PredictionStats } from '@/types';

export const IndicatorDonutCard = ({ title, counts, description }: { title: string; counts: IndicatorCounts; description?: string }) => {
  const data = (['GOOD', 'AVERAGE', 'NEEDS_ATTENTION', 'NO_DATA'] as const).map((key) => ({ name: humanize(key), value: counts[key] ?? 0, color: INDICATOR_COLORS[key] }));
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <Card>
      <CardHeader title={title} description={description ?? `${total} enrolments classified`} />
      <CardBody>{total ? <DonutChart data={data} /> : <EmptyState title="No data yet" />}</CardBody>
    </Card>
  );
};

export const ScoreBandsCard = ({ stats }: { stats: PredictionStats }) => (
  <Card>
    <CardHeader
      title="Predicted score distribution"
      description={`${stats.total_predictions} predictions · avg ${fmtScore(stats.average_predicted_score)} · range ${fmtScore(stats.lowest_predicted_score)}–${fmtScore(stats.highest_predicted_score)}`}
    />
    <CardBody>
      {stats.score_bands.length ? (
        <SimpleBarChart data={stats.score_bands.map((band) => ({ band: band.band, count: band.count }))} xKey="band" series={[{ key: 'count', label: 'Students' }]} />
      ) : (
        <EmptyState title="No predictions yet" />
      )}
    </CardBody>
  </Card>
);

export const CoursePerformanceChart = ({ courses }: { courses: CourseAnalyticsRow[] }) => (
  <Card>
    <CardHeader title="Course performance" description="Average attendance, performance and predicted score" />
    <CardBody>
      {courses.length ? (
        <SimpleBarChart
          data={courses.map((course) => ({
            course: course.title.length > 16 ? `${course.title.slice(0, 15)}…` : course.title,
            attendance: course.average_attendance,
            performance: course.average_performance,
            predicted: course.average_predicted_score,
          }))}
          xKey="course"
          domain={[0, 100]}
          series={[
            { key: 'attendance', label: 'Attendance %', color: '#9fd356' },
            { key: 'performance', label: 'Performance' },
            { key: 'predicted', label: 'Predicted', color: '#f6c445' },
          ]}
        />
      ) : (
        <EmptyState title="No courses yet" />
      )}
    </CardBody>
  </Card>
);

export const AttentionList = ({ rows, title = 'Students needing attention', linkTo }: { rows: AttentionRow[]; title?: string; linkTo?: string }) => (
  <Card>
    <CardHeader
      icon={<AlertTriangle className="h-4 w-4" />}
      title={title}
      description="Flagged by attendance, coursework or the ML forecast"
      action={linkTo && <Link to={linkTo} className="text-xs font-semibold text-brand-700">View all</Link>}
    />
    <CardBody className="space-y-2">
      {rows.length === 0 && <p className="py-6 text-center text-sm text-slate-400">Great news — nobody is flagged right now.</p>}
      {rows.slice(0, 6).map((row) => (
        <div key={row.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">{row.student_name}</p>
            <p className="truncate text-[11px] text-slate-500">
              {row.course} · Att {fmtPct(row.attendance_percentage)} · {row.reasons.slice(0, 2).join(', ') || 'Low performance'}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-base font-bold text-slate-900">{fmtScore(row.predicted_final_score ?? row.overall_score)}</p>
            <IndicatorBadge indicator={row.prediction_indicator ?? row.indicator} />
          </div>
        </div>
      ))}
    </CardBody>
  </Card>
);

const pickText = (row: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === 'string' && value) return value;
    if (typeof value === 'number') return String(value);
    if (value && typeof value === 'object' && 'title' in value && typeof (value as { title: unknown }).title === 'string') return (value as { title: string }).title;
    if (value && typeof value === 'object' && 'full_name' in value) return String((value as { full_name: unknown }).full_name);
  }
  return '';
};

/** Lists loosely-typed dashboard work items (submissions, assessments, deadlines). */
export const WorkList = ({ title, rows, dateKeys, emptyText }: { title: string; rows: Record<string, unknown>[]; dateKeys: string[]; emptyText: string }) => (
  <Card>
    <CardHeader title={title} description={`${rows.length} item${rows.length === 1 ? '' : 's'}`} />
    <CardBody className="space-y-2">
      {rows.length === 0 && <p className="py-4 text-center text-sm text-slate-400">{emptyText}</p>}
      {rows.slice(0, 5).map((row, index) => {
        const date = pickText(row, dateKeys);
        return (
          <div key={String(row.id ?? index)} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">{pickText(row, ['title', 'assignment_title', 'assignment', 'assessment_title', 'student_name', 'student'])}</p>
              <p className="truncate text-[11px] text-slate-500">{pickText(row, ['course', 'course_title', 'student_name', 'student'])}</p>
            </div>
            {date && <span className="shrink-0 rounded-full bg-sun-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">{/\d{4}-\d{2}-\d{2}/.test(date) ? formatDate(date) : date}</span>}
          </div>
        );
      })}
    </CardBody>
  </Card>
);

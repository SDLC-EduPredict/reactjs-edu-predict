import type { ReactNode } from 'react';
import { DataTable, type Column } from '@/components/ui';
import { formatNumber, formatPercent } from '@/lib/utils/format';
import type { MonitoredStudent } from '../types';
import { IndicatorBadge } from './IndicatorBadge';

interface Props {
  rows: MonitoredStudent[] | undefined;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onSelect?: (row: MonitoredStudent) => void;
  action?: (row: MonitoredStudent) => ReactNode;
  emptyTitle?: string;
}

export const MonitoredStudentsTable = ({ rows, loading, error, onRetry, onSelect, action, emptyTitle = 'No students to show' }: Props) => {
  const columns: Column<MonitoredStudent>[] = [
    {
      key: 'student',
      header: 'Student',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.student.full_name}</p>
          <p className="text-[11px] text-slate-400">{row.student.student_code ?? row.student.email}</p>
        </div>
      ),
    },
    { key: 'course', header: 'Course', render: (row) => row.course.title },
    { key: 'attendance', header: 'Attendance', render: (row) => formatPercent(row.performance?.attendance_percentage, 0) },
    { key: 'assignments', header: 'Assignments', render: (row) => formatNumber(row.performance?.assignment_average, 1) },
    { key: 'tests', header: 'Mock tests', render: (row) => formatNumber(row.performance?.mock_test_average, 1) },
    {
      key: 'predicted',
      header: 'Predicted',
      render: (row) => <span className="font-bold text-slate-900">{formatNumber(row.prediction?.predicted_score, 1)}</span>,
    },
    {
      key: 'indicator',
      header: 'Indicator',
      render: (row) => (
        <IndicatorBadge
          indicator={row.prediction?.indicator ?? row.performance?.indicator}
          label={row.prediction ? row.prediction.indicator_display : row.performance?.indicator_display}
        />
      ),
    },
    {
      key: 'reasons',
      header: 'Flags',
      render: (row) =>
        row.reasons && row.reasons.length > 0 ? (
          <ul className="max-w-[240px] list-disc pl-4 text-[11px] text-amber-700">
            {row.reasons.slice(0, 2).map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        ) : (
          <span className="text-xs text-slate-300">—</span>
        ),
    },
    ...(action ? [{ key: 'action', header: '', render: action }] : []),
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows}
      rowKey={(row) => `${row.enrolment_id ?? row.id ?? ''}-${row.student.id}-${row.course.id}`}
      loading={loading}
      error={error}
      onRetry={onRetry}
      onRowClick={onSelect}
      emptyTitle={emptyTitle}
    />
  );
};

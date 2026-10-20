import { CalendarCheck2 } from 'lucide-react';
import { Card, CardHeader, DataTable, ErrorState, PageHeader, ProgressBar, Skeleton, StatCard, StatusBadge, type Column } from '@/components/ui';
import { SimpleBarChart } from '@/components/charts/Charts';
import { getErrorMessage } from '@/lib/api/apiError';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { formatDate, formatPercent } from '@/lib/utils/format';
import { useMyAttendance } from '../hooks/useAttendance';
import type { AttendanceRecord } from '../types';

const columns: Column<AttendanceRecord>[] = [
  { key: 'date', header: 'Date', render: (row) => formatDate(row.session_date) },
  { key: 'course', header: 'Course', render: (row) => row.course?.title ?? '—' },
  { key: 'topic', header: 'Session', render: (row) => row.session_topic || '—' },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} label={row.status_display} /> },
  { key: 'remarks', header: 'Remarks', render: (row) => <span className="text-xs text-slate-500">{row.remarks || '—'}</span> },
];

export const StudentAttendancePage = () => {
  useDocumentTitle('Attendance');
  const attendance = useMyAttendance();

  if (attendance.isError) return <ErrorState message={getErrorMessage(attendance.error)} onRetry={() => attendance.refetch()} />;
  const data = attendance.data;
  const tone = (value: number): 'green' | 'brand' | 'amber' | 'rose' => (value >= 85 ? 'green' : value >= 75 ? 'brand' : value >= 60 ? 'amber' : 'rose');

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Academics" title="Attendance" description="Minimum 75% attendance is recommended for every enrolled course." />
      <div className="grid gap-4 sm:grid-cols-3">
        {attendance.isPending ? (
          Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-28" />)
        ) : (
          <>
            <StatCard label="Overall attendance" value={formatPercent(data?.overall ?? null, 1)} icon={<CalendarCheck2 className="h-5 w-5" />} tone={data?.overall && data.overall < 75 ? 'rose' : 'green'} />
            <StatCard label="Sessions recorded" value={data?.summary.reduce((sum, item) => sum + item.total_sessions, 0) ?? data?.records.length ?? 0} tone="brand" />
            <StatCard label="Sessions missed" value={data?.summary.reduce((sum, item) => sum + item.absent, 0) ?? 0} tone="amber" />
          </>
        )}
      </div>
      {data && data.summary.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader title="Attendance by course" />
            <div className="space-y-4 p-5">
              {data.summary.map((item) => (
                <div key={item.course.id}>
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{item.course.title}</span>
                    <span className="font-bold text-slate-900">
                      {formatPercent(item.attendance_percentage, 1)} · {item.present}/{item.total_sessions}
                    </span>
                  </div>
                  <ProgressBar value={item.attendance_percentage} tone={tone(item.attendance_percentage)} />
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHeader title="Present vs absent" />
            <div className="p-4">
              <SimpleBarChart
                data={data.summary.map((item) => ({ course: item.course.title.slice(0, 14), present: item.present, absent: item.absent }))}
                xKey="course"
                series={[
                  { key: 'present', label: 'Present', color: '#10b981' },
                  { key: 'absent', label: 'Absent', color: '#f43f5e' },
                ]}
              />
            </div>
          </Card>
        </div>
      )}
      <Card>
        <CardHeader title="Session history" />
        <DataTable columns={columns} rows={data?.records} rowKey={(row) => row.id} loading={attendance.isPending} emptyTitle="No attendance recorded yet" />
      </Card>
    </div>
  );
};

export default StudentAttendancePage;

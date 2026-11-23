import { useState } from 'react';
import { CalendarCheck2, CalendarX2, Clock } from 'lucide-react';
import { Card, CardBody, CardHeader, DataTable, EmptyState, PageHeader, StatusBadge, Tabs } from '@/components/ui';
import { DonutChart } from '@/components/charts/Charts';
import { fmtPct, Kpi } from '@/components/domain/Metric';
import { QueryView } from '@/components/domain/QueryView';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { formatDate } from '@/lib/utils/format';
import { useMyAttendance } from '../hooks/useAttendance';

const StudentAttendancePage = () => {
  useDocumentTitle('My Attendance');
  const attendance = useMyAttendance();
  const [active, setActive] = useState('');

  return (
    <>
      <PageHeader eyebrow="Learning" title="Attendance" description="Session-by-session attendance, as marked by your faculty." />
      <QueryView query={attendance}>
        {(courses) => {
          if (courses.length === 0) return <EmptyState title="No attendance yet" description="Attendance appears here once classes begin." />;
          const current = courses.find((item) => String(item.enrolment_id) === active) ?? courses[0];
          const s = current.summary;
          return (
            <div className="space-y-6">
              <Tabs tabs={courses.map((item) => ({ value: String(item.enrolment_id), label: item.course.title }))} value={String(current.enrolment_id)} onChange={setActive} />
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Kpi label="Attendance" value={fmtPct(s.attendance_percentage)} tone="navy" icon={<CalendarCheck2 className="h-4 w-4" />} hint={`${s.total_classes} classes held`} />
                <Kpi label="Present" value={s.present} tone="lime" icon={<CalendarCheck2 className="h-4 w-4" />} />
                <Kpi label="Late" value={s.late} tone="sun" icon={<Clock className="h-4 w-4" />} />
                <Kpi label="Absent" value={s.absent} tone="rose" icon={<CalendarX2 className="h-4 w-4" />} />
              </div>
              <div className="grid gap-6 xl:grid-cols-[1fr_2fr]">
                <Card>
                  <CardHeader title="Breakdown" description={current.course.title} />
                  <CardBody>
                    <DonutChart
                      data={[
                        { name: 'Present', value: s.present, color: '#9fd356' },
                        { name: 'Late', value: s.late, color: '#f6c445' },
                        { name: 'Absent', value: s.absent, color: '#f43f5e' },
                      ]}
                    />
                    {(s.attendance_percentage ?? 100) < 75 && (
                      <p className="mt-3 rounded-xl bg-rose-50 p-3 text-xs text-rose-700">Your attendance is below the recommended 75%. This lowers your predicted final score.</p>
                    )}
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader title="Session log" description={`${current.records.length} records`} />
                  <DataTable
                    rows={current.records}
                    rowKey={(row) => row.id}
                    emptyTitle="No sessions marked yet"
                    columns={[
                      { key: 'date', header: 'Date', render: (row) => <span className="font-semibold text-slate-900">{formatDate(row.date)}</span> },
                      { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} label={row.status_display} /> },
                      { key: 'remarks', header: 'Remarks', render: (row) => row.remarks || <span className="text-slate-400">—</span> },
                    ]}
                  />
                </Card>
              </div>
            </div>
          );
        }}
      </QueryView>
    </>
  );
};

export default StudentAttendancePage;

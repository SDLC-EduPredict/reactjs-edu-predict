import { Activity, Award, BookOpen, CalendarCheck2 } from 'lucide-react';
import { Card, CardBody, CardHeader, EmptyState, PageHeader } from '@/components/ui';
import { FeatureRadar, SimpleBarChart } from '@/components/charts/Charts';
import { IndicatorBadge } from '@/components/domain/IndicatorBadge';
import { fmtPct, fmtScore, Kpi, Meter } from '@/components/domain/Metric';
import { QueryView } from '@/components/domain/QueryView';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { formatDate } from '@/lib/utils/format';
import { useMyPerformance } from '../hooks/usePerformance';

const StudentPerformancePage = () => {
  useDocumentTitle('My Performance');
  const performance = useMyPerformance();
  return (
    <>
      <PageHeader eyebrow="Intelligence" title="My Performance" description="Your consolidated academic index, built from attendance, coursework and tests." />
      <QueryView query={performance}>
        {({ overall, courses }) => (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Kpi label="Overall score" value={fmtScore(overall.overall_score)} tone="navy" icon={<Award className="h-4 w-4" />} hint={<IndicatorBadge indicator={overall.indicator} label={overall.indicator_display} />} />
              <Kpi label="Attendance" value={fmtPct(overall.attendance_percentage)} tone="lime" icon={<CalendarCheck2 className="h-4 w-4" />} />
              <Kpi label="Assessments avg" value={fmtScore(overall.assessment_average)} tone="sun" icon={<Activity className="h-4 w-4" />} />
              <Kpi label="Courses tracked" value={overall.courses} icon={<BookOpen className="h-4 w-4" />} />
            </div>
            {courses.length === 0 ? (
              <EmptyState title="No performance records yet" description="Enrol in a course to start building your academic index." />
            ) : (
              <>
                <div className="grid gap-6 xl:grid-cols-2">
                  <Card>
                    <CardHeader title="Skill profile" description="Overall metrics on a 0–100 scale" />
                    <CardBody>
                      <FeatureRadar
                        data={[
                          { feature: 'Attendance', value: overall.attendance_percentage ?? 0 },
                          { feature: 'Assignments', value: overall.assignment_average ?? 0 },
                          { feature: 'Mock tests', value: overall.mock_test_average ?? 0 },
                          { feature: 'Exams', value: overall.exam_average ?? 0 },
                          { feature: 'Modules', value: overall.modules_completed_percentage ?? 0 },
                          { feature: 'Previous', value: overall.previous_score ?? 0 },
                        ]}
                      />
                    </CardBody>
                  </Card>
                  <Card>
                    <CardHeader title="Course comparison" description="Overall score per course" />
                    <CardBody>
                      <SimpleBarChart
                        data={courses.map((item) => ({ course: item.course.title, overall: item.performance.overall_score, attendance: item.performance.attendance_percentage }))}
                        xKey="course"
                        series={[
                          { key: 'overall', label: 'Overall score' },
                          { key: 'attendance', label: 'Attendance %', color: '#9fd356' },
                        ]}
                        domain={[0, 100]}
                      />
                    </CardBody>
                  </Card>
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  {courses.map(({ enrolment_id, course, performance: p }) => (
                    <Card key={enrolment_id}>
                      <CardHeader title={course.title} description={`Updated ${formatDate(p.calculated_at, true)}`} action={<IndicatorBadge indicator={p.indicator} label={p.indicator_display} />} />
                      <CardBody className="space-y-4">
                        <Meter label="Attendance" value={p.attendance_percentage} suffix="%" />
                        <Meter label="Assignment average" value={p.assignment_average} />
                        <Meter label="Mock test average" value={p.mock_test_average} />
                        <Meter label="Exam average" value={p.exam_average} />
                        <Meter label={`Modules completed (${p.modules_completed ?? 0}/${p.total_modules})`} value={p.modules_completed_percentage} suffix="%" />
                        <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                          <div className="rounded-2xl bg-slate-50 p-3">
                            <p className="text-[11px] text-slate-500">Practice hrs</p>
                            <p className="font-display text-lg font-bold">{fmtScore(p.practice_hours)}</p>
                          </div>
                          <div className="rounded-2xl bg-slate-50 p-3">
                            <p className="text-[11px] text-slate-500">Participation</p>
                            <p className="font-display text-lg font-bold">{p.participation_display || '—'}</p>
                          </div>
                          <div className="rounded-2xl bg-brand-50 p-3">
                            <p className="text-[11px] text-brand-700">Overall</p>
                            <p className="font-display text-lg font-bold text-brand-700">{fmtScore(p.overall_score)}</p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </QueryView>
    </>
  );
};

export default StudentPerformancePage;

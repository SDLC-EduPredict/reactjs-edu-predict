import { useMemo } from 'react';
import { BrainCircuit, RefreshCw } from 'lucide-react';
import { Button, Card, CardHeader, ErrorState, PageHeader, Select, Skeleton, StatCard } from '@/components/ui';
import { DonutChart } from '@/components/charts/Charts';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { getErrorMessage } from '@/lib/api/apiError';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { MonitoredStudentsTable } from '@/features/performance/components/MonitoredStudentsTable';
import { INDICATOR_COLORS } from '@/features/performance/constants';
import { useMonitoredStudents } from '@/features/performance/hooks/usePerformance';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';
import { usePredictionDistribution } from '@/features/reports/hooks/useReports';
import { formatNumber, humanize } from '@/lib/utils/format';
import { PredictionCard } from '../components/PredictionCard';
import { WhatIfSimulator } from '../components/WhatIfSimulator';
import { usePredict, useStudentPrediction } from '../hooks/usePredictions';
import { selectLastPrediction, selectSelectedStudentId, studentSelected } from '../store/predictionSlice';

export const MLPredictionDashboardPage = () => {
  useDocumentTitle('ML prediction dashboard');
  const dispatch = useAppDispatch();
  const { isAdmin, hasPermission } = useCurrentUser();
  const selectedId = useAppSelector(selectSelectedStudentId);
  const lastResult = useAppSelector(selectLastPrediction);
  const students = useMonitoredStudents({ page: 1, page_size: 200 });
  const prediction = useStudentPrediction(selectedId);
  const predict = usePredict();
  const canSeeReports = isAdmin || hasPermission('VIEW_REPORTS');
  const distribution = usePredictionDistribution(canSeeReports);

  const rows = students.data?.rows;
  const stats = useMemo(() => {
    const scored = (rows ?? []).filter((row) => typeof row.prediction?.predicted_score === 'number');
    const avg = scored.length ? scored.reduce((sum, row) => sum + (row.prediction?.predicted_score ?? 0), 0) / scored.length : null;
    const attention = scored.filter((row) => row.prediction?.indicator === 'NEEDS_ATTENTION').length;
    return { scored: scored.length, avg, attention };
  }, [rows]);

  const donut = (canSeeReports && distribution.data?.length ? distribution.data : null)?.map((item) => ({
    name: item.indicator_display ?? humanize(item.indicator),
    value: item.count,
    color: INDICATOR_COLORS[item.indicator],
  })) ??
    Object.entries(
      (rows ?? []).reduce<Record<string, number>>((acc, row) => {
        const key = row.prediction?.indicator;
        if (key) acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      }, {}),
    ).map(([indicator, count]) => ({ name: humanize(indicator), value: count, color: INDICATOR_COLORS[indicator] }));

  const options = (rows ?? []).map((row) => ({ value: row.student.id, label: `${row.student.full_name} · ${row.course.title}` }));
  const uniqueOptions = Array.from(new Map(options.map((item) => [item.value, item])).values());

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Machine Learning" title="ML prediction dashboard" description="Linear Regression predictions of final scores for the students you monitor." />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Students with a prediction" value={stats.scored} icon={<BrainCircuit className="h-5 w-5" />} />
        <StatCard label="Average predicted score" value={formatNumber(stats.avg, 1)} tone="violet" />
        <StatCard label="Needs attention" value={stats.attention} tone="rose" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader title="Predictions by student" description="Select a student below to inspect or regenerate their prediction." />
          <MonitoredStudentsTable
            rows={rows}
            loading={students.isPending}
            error={students.isError ? getErrorMessage(students.error) : null}
            onRetry={() => students.refetch()}
            onSelect={(row) => dispatch(studentSelected(row.student.id))}
          />
        </Card>
        <Card>
          <CardHeader title="Indicator distribution" />
          <div className="p-4">{donut.length > 0 ? <DonutChart data={donut} /> : <p className="py-16 text-center text-xs text-slate-400">No predictions yet.</p>}</div>
        </Card>
      </div>
      <Card>
        <CardHeader
          title="Student prediction"
          action={
            <div className="flex flex-col gap-2 sm:flex-row">
              <Select
                aria-label="Student"
                containerClassName="sm:w-72"
                value={selectedId ?? ''}
                onChange={(event) => dispatch(studentSelected(event.target.value ? Number(event.target.value) : null))}
                placeholder="Select a student"
                options={uniqueOptions}
              />
              <Button icon={<RefreshCw className="h-4 w-4" />} disabled={selectedId === null} loading={predict.isPending} onClick={() => selectedId !== null && predict.mutate({ student_id: selectedId })}>
                Regenerate
              </Button>
            </div>
          }
        />
        <div className="p-5">
          {selectedId === null ? (
            <p className="py-10 text-center text-sm text-slate-500">Choose a student to see their latest prediction.</p>
          ) : prediction.isPending ? (
            <Skeleton className="h-60" />
          ) : prediction.isError ? (
            <ErrorState message={getErrorMessage(prediction.error)} onRetry={() => prediction.refetch()} />
          ) : (
            <PredictionCard prediction={prediction.data.latest} title="Latest prediction" />
          )}
        </div>
      </Card>
      <div className="grid gap-6 xl:grid-cols-2">
        <WhatIfSimulator />
        {lastResult ? <PredictionCard prediction={lastResult} title="Simulation result" /> : <Card className="flex items-center justify-center p-10 text-center text-sm text-slate-400">Run the simulator to estimate a score from custom values.</Card>}
      </div>
    </div>
  );
};

export default MLPredictionDashboardPage;

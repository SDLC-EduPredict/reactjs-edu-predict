import { Card, CardHeader, ErrorState, PageHeader, Skeleton } from '@/components/ui';
import { SimpleLineChart } from '@/components/charts/Charts';
import { useAppSelector } from '@/app/store/hooks';
import { getErrorMessage } from '@/lib/api/apiError';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { formatDate } from '@/lib/utils/format';
import { useOwnStudentProfile } from '@/features/students/hooks/useStudents';
import { useMyPerformance } from '@/features/performance/hooks/usePerformance';
import { PredictionCard } from '../components/PredictionCard';
import { WhatIfSimulator } from '../components/WhatIfSimulator';
import { useStudentPrediction } from '../hooks/usePredictions';
import { selectLastPrediction } from '../store/predictionSlice';

export const StudentPredictionPage = () => {
  useDocumentTitle('Predicted score');
  const profile = useOwnStudentProfile();
  const prediction = useStudentPrediction(profile.data?.id);
  const performance = useMyPerformance();
  const lastResult = useAppSelector(selectLastPrediction);
  const latestPerformance = performance.data?.[0];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Insights" title="Predicted final score" description="Your expected final score estimated by the Linear Regression model from your academic indicators." />
      {profile.isError ? (
        <ErrorState message={getErrorMessage(profile.error)} onRetry={() => profile.refetch()} />
      ) : prediction.isPending && profile.data ? (
        <Skeleton className="h-72" />
      ) : prediction.isError ? (
        <ErrorState message={getErrorMessage(prediction.error)} onRetry={() => prediction.refetch()} />
      ) : (
        <PredictionCard prediction={prediction.data?.latest ?? null} title="My latest prediction" />
      )}
      <div className="grid gap-6 xl:grid-cols-2">
        <WhatIfSimulator
          studentId={profile.data?.id}
          currentFeatures={
            latestPerformance
              ? {
                  attendance_percentage: latestPerformance.attendance_percentage,
                  assignment_average: latestPerformance.assignment_average,
                  mock_test_average: latestPerformance.mock_test_average,
                  practice_hours_per_week: latestPerformance.practice_hours_per_week,
                  previous_score: latestPerformance.previous_score,
                  modules_completed: latestPerformance.modules_completed,
                }
              : null
          }
        />
        {lastResult ? (
          <PredictionCard prediction={lastResult} title="Simulation result" />
        ) : (
          <Card>
            <CardHeader title="Prediction history" description="How your predicted score has changed over time" />
            <div className="p-4">
              {prediction.data && prediction.data.history.length > 1 ? (
                <SimpleLineChart
                  data={[...prediction.data.history].reverse().map((item) => ({ date: formatDate(item.created_at), score: item.predicted_score }))}
                  xKey="date"
                  series={[{ key: 'score', label: 'Predicted score' }]}
                  domain={[0, 100]}
                />
              ) : (
                <p className="py-16 text-center text-xs text-slate-400">Run the simulator or wait for more predictions to see a trend.</p>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentPredictionPage;

import { useState } from 'react';
import { BrainCircuit, RefreshCw, RotateCcw, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Alert, Button, Card, CardBody, CardHeader, DataTable, Modal, PageHeader, Pagination, SearchInput, Select, Skeleton, Tabs } from '@/components/ui';
import { ScoreGauge } from '@/components/charts/ScoreGauge';
import { IndicatorBadge } from '@/components/domain/IndicatorBadge';
import { fmtPct, fmtScore } from '@/components/domain/Metric';
import { QueryView } from '@/components/domain/QueryView';
import { StaffCourseSelect } from '@/components/domain/StaffCourseSelect';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useListFilter } from '@/lib/hooks/useListFilter';
import { formatDate, humanize } from '@/lib/utils/format';
import { ENROLMENT_STATUSES, INDICATORS } from '@/types';
import { PredictionCard } from '../components/PredictionCard';
import { FEATURE_KEYS, FEATURE_META } from '../constants';
import { usePredict, usePredictionList, useStudentPrediction } from '../hooks/usePredictions';
import { featureChanged, featuresLoaded, featuresReset, selectLastPrediction, selectSelectedStudentId, selectSimulator, studentSelected } from '../store/predictionSlice';
import { isWhatIfResult, type PredictionListRow } from '../types';

const ORDERING = [
  { value: 'predicted_final_score', label: 'Lowest predicted first' },
  { value: '-predicted_final_score', label: 'Highest predicted first' },
  { value: '-updated_at', label: 'Recently updated' },
];

const StudentPredictionModal = () => {
  const dispatch = useAppDispatch();
  const studentId = useAppSelector(selectSelectedStudentId);
  const detail = useStudentPrediction(studentId);
  const predict = usePredict();
  return (
    <Modal open={studentId !== null} onClose={() => dispatch(studentSelected(null))} title={detail.data?.student.full_name ?? 'Student prediction'} description={detail.data?.student.student_code} size="xl">
      <QueryView query={detail} loading={<Skeleton className="h-72 w-full" />}>
        {(data) => (
          <div className="space-y-4">
            {data.note && <Alert tone="info">{data.note}</Alert>}
            <div className="grid gap-5 lg:grid-cols-2">
              {data.courses.map((item) => (
                <PredictionCard
                  key={item.enrolment_id}
                  item={item}
                  action={
                    <Button variant="sun" size="sm" icon={<RefreshCw className="h-3.5 w-3.5" />} loading={predict.isPending && predict.variables && 'enrolment' in predict.variables && predict.variables.enrolment === item.enrolment_id} onClick={() => predict.mutate({ enrolment: item.enrolment_id })}>
                      Re-run prediction
                    </Button>
                  }
                />
              ))}
            </div>
          </div>
        )}
      </QueryView>
    </Modal>
  );
};

const PredictionsTable = ({ onLoaded }: { onLoaded: () => void }) => {
  const dispatch = useAppDispatch();
  const list = useListFilter('staff-predictions');
  const f = list.filters;
  const predictions = usePredictionList({ ...list.params, course: f.course || undefined, indicator: f.indicator || undefined, status: f.status || undefined, ordering: f.ordering || undefined });
  const predict = usePredict();

  const loadIntoSimulator = (row: PredictionListRow) => {
    dispatch(featuresLoaded(Object.fromEntries(FEATURE_KEYS.map((key) => [key, row[key]]))));
    onLoaded();
  };

  return (
    <Card className="overflow-hidden">
      <div className="grid gap-3 border-b border-slate-100 p-4 md:grid-cols-2 xl:grid-cols-5">
        <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search students…" className="xl:col-span-2" />
        <StaffCourseSelect value={f.course ?? ''} onChange={(value) => list.setFilter('course', value)} />
        <Select aria-label="Indicator" placeholder="All standings" value={f.indicator ?? ''} onChange={(e) => list.setFilter('indicator', e.target.value)} options={INDICATORS.map((value) => ({ value, label: humanize(value) }))} />
        <Select aria-label="Order" placeholder="Default order" value={f.ordering ?? ''} onChange={(e) => list.setFilter('ordering', e.target.value)} options={ORDERING} />
      </div>
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2 text-xs">
        <span className="font-semibold text-slate-500">Enrolment:</span>
        {[{ value: '', label: 'All' }, ...ENROLMENT_STATUSES].map((s) => (
          <button key={s.value || 'all'} type="button" onClick={() => list.setFilter('status', s.value)} className={`rounded-full px-3 py-1 font-semibold ${(f.status ?? '') === s.value ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {s.label}
          </button>
        ))}
      </div>
      <DataTable
        rows={predictions.data?.results}
        loading={predictions.isPending}
        rowKey={(row) => row.id}
        emptyTitle="No predictions yet"
        emptyDescription="Predictions are generated automatically as academic data is recorded, or run one from a student's insights."
        columns={[
          {
            key: 'student',
            header: 'Student',
            render: (row) => (
              <button type="button" className="text-left" onClick={() => dispatch(studentSelected(row.student.id))}>
                <p className="font-semibold text-slate-900 hover:text-brand-700">{row.student.full_name}</p>
                <p className="text-[11px] text-slate-500">{row.course.title}</p>
              </button>
            ),
          },
          { key: 'att', header: 'Attend.', render: (row) => fmtPct(row.attendance) },
          { key: 'asg', header: 'Assign.', render: (row) => fmtScore(row.assignment_average) },
          { key: 'mock', header: 'Mock', render: (row) => fmtScore(row.mock_test_average) },
          { key: 'prac', header: 'Practice', render: (row) => fmtScore(row.practice_hours) },
          { key: 'pred', header: 'Predicted', render: (row) => <span className="font-display text-base font-bold text-brand-700">{fmtScore(row.predicted_final_score)}</span> },
          { key: 'ind', header: 'Standing', render: (row) => <IndicatorBadge indicator={row.indicator} label={row.indicator_display} /> },
          { key: 'upd', header: 'Updated', render: (row) => <span className="text-[11px]">{formatDate(row.updated_at)}</span> },
          {
            key: 'actions',
            header: '',
            className: 'text-right',
            render: (row) => (
              <div className="flex justify-end gap-1">
                <Button size="sm" variant="ghost" aria-label="Load into simulator" icon={<SlidersHorizontal className="h-3.5 w-3.5" />} onClick={() => loadIntoSimulator(row)} />
                <Button size="sm" variant="secondary" icon={<RefreshCw className="h-3.5 w-3.5" />} loading={predict.isPending && predict.variables && 'enrolment' in predict.variables && predict.variables.enrolment === row.enrolment} onClick={() => predict.mutate({ enrolment: row.enrolment })}>
                  Predict
                </Button>
              </div>
            ),
          },
        ]}
      />
      <Pagination page={list.page} pageSize={list.pageSize} count={predictions.data?.count ?? 0} onPageChange={list.setPage} />
    </Card>
  );
};

const WhatIfSimulator = () => {
  const dispatch = useAppDispatch();
  const values = useAppSelector(selectSimulator);
  const last = useAppSelector(selectLastPrediction);
  const predict = usePredict();
  const result = last && isWhatIfResult(last) ? last : null;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
      <Card>
        <CardHeader
          icon={<SlidersHorizontal className="h-4 w-4" />}
          title="What-if score simulator"
          description="Adjust the six model features to see how the active Linear Regression model responds."
          action={
            <Button size="sm" variant="ghost" icon={<RotateCcw className="h-3.5 w-3.5" />} onClick={() => dispatch(featuresReset())}>
              Reset
            </Button>
          }
        />
        <CardBody className="space-y-5">
          {FEATURE_KEYS.map((key) => {
            const meta = FEATURE_META[key];
            return (
              <div key={key}>
                <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>{meta.label}</span>
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-brand-700">
                    {values[key]}
                    {meta.unit}
                  </span>
                </div>
                <input type="range" min={0} max={meta.max} step={meta.step} value={values[key]} onChange={(event) => dispatch(featureChanged({ key, value: Number(event.target.value) }))} className="w-full accent-brand-700" />
              </div>
            );
          })}
          <Button fullWidth size="lg" icon={<BrainCircuit className="h-4 w-4" />} loading={predict.isPending} onClick={() => predict.mutate(values)}>
            Predict final score
          </Button>
        </CardBody>
      </Card>
      <div className="navy-panel flex flex-col items-center justify-center rounded-3xl p-8 text-center text-white shadow-lift">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-sun-300">
          <Sparkles className="h-3.5 w-3.5" /> Simulated forecast
        </p>
        <ScoreGauge dark className="mt-4" size={220} score={result?.predicted_final_score} max={result?.max_score ?? 100} label="Predicted final score" />
        {result ? (
          <>
            <div className="mt-3">
              <IndicatorBadge indicator={result.indicator} label={result.indicator_display} />
            </div>
            <p className="mt-4 text-xs text-white/60">
              {result.model_version.name} · R² {result.model_version.r2_score.toFixed(3)} · RMSE {result.model_version.rmse.toFixed(2)}
            </p>
            {result.note && <p className="mt-2 max-w-sm text-[11px] text-white/50">{result.note}</p>}
          </>
        ) : (
          <p className="mt-4 max-w-xs text-sm text-white/60">Move the sliders and run a prediction to see the forecast here.</p>
        )}
      </div>
    </div>
  );
};

const StaffPredictionsPage = () => {
  useDocumentTitle('ML Score Predictor');
  const [tab, setTab] = useState<'list' | 'simulator'>('list');
  return (
    <>
      <PageHeader
        eyebrow="Intelligence"
        title="ML Score Predictor"
        description="Predicted final scores for every enrolment, per-student insights and a what-if simulator."
        actions={
          <Tabs
            tabs={[
              { value: 'list', label: 'Predictions' },
              { value: 'simulator', label: 'What-if simulator' },
            ]}
            value={tab}
            onChange={setTab}
          />
        }
      />
      {tab === 'list' ? <PredictionsTable onLoaded={() => setTab('simulator')} /> : <WhatIfSimulator />}
      <StudentPredictionModal />
    </>
  );
};

export default StaffPredictionsPage;

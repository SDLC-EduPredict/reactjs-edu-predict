import { useState } from 'react';
import { CheckCircle2, Cpu, Database, FileUp, FlaskConical, Power } from 'lucide-react';
import { Badge, Button, Card, CardBody, CardHeader, DataTable, EmptyState, PageHeader } from '@/components/ui';
import { SimpleBarChart } from '@/components/charts/Charts';
import { Kpi } from '@/components/domain/Metric';
import { QueryView } from '@/components/domain/QueryView';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { cn } from '@/lib/utils/cn';
import { formatDate, humanize } from '@/lib/utils/format';
import { useActivateModel, useModels, useTrainModel } from '../hooks/usePredictions';
import type { MlModel, TrainSource } from '../types';

const SOURCES: { value: TrainSource; title: string; text: string; icon: typeof Database }[] = [
  { value: 'DATABASE', title: 'Live database', text: 'Train on real enrolment performance records.', icon: Database },
  { value: 'SAMPLE', title: 'Sample dataset', text: 'Bootstrap with the bundled synthetic dataset.', icon: FlaskConical },
  { value: 'CSV', title: 'Upload CSV', text: 'Train on an exported or curated CSV file.', icon: FileUp },
];

const ModelDetail = ({ model }: { model: MlModel }) => (
  <Card>
    <CardHeader
      icon={<Cpu className="h-4 w-4" />}
      title={`${model.name} · v${model.version}`}
      description={`${model.algorithm} · ${model.data_source_display}${model.source_name ? ` (${model.source_name})` : ''} · trained ${formatDate(model.created_at, true)}${model.trained_by ? ` by ${model.trained_by}` : ''}`}
      action={model.is_active ? <Badge tone="lime" icon={<CheckCircle2 className="h-3 w-3" />}>Active</Badge> : undefined}
    />
    <CardBody className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: 'R² score', value: model.r2_score.toFixed(3) },
          { label: 'RMSE', value: model.rmse.toFixed(2) },
          { label: 'MAE', value: model.mae.toFixed(2) },
          { label: 'MSE', value: model.mse.toFixed(2) },
        ].map((m) => (
          <div key={m.label} className="rounded-2xl bg-brand-50 p-3">
            <p className="text-[11px] text-brand-700">{m.label}</p>
            <p className="font-display text-xl font-bold text-slate-900">{m.value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold text-slate-500">Regression coefficients (intercept {model.intercept.toFixed(2)})</p>
          <SimpleBarChart data={Object.entries(model.coefficients).map(([feature, value]) => ({ feature: humanize(feature), value: Number(value.toFixed(3)) }))} xKey="feature" series={[{ key: 'value', label: 'Weight' }]} height={240} />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold text-slate-500">Correlation with {humanize(model.target)}</p>
          <SimpleBarChart data={Object.entries(model.correlations).map(([feature, value]) => ({ feature: humanize(feature), value: Number(value.toFixed(3)) }))} xKey="feature" series={[{ key: 'value', label: 'Correlation', color: '#9fd356' }]} height={240} />
        </div>
      </div>
      <div className="grid gap-3 text-center text-xs sm:grid-cols-4">
        {[
          { label: 'Total rows', value: model.total_rows },
          { label: 'Cleaned rows', value: model.cleaned_rows },
          { label: 'Training rows', value: model.training_rows },
          { label: 'Test rows', value: model.test_rows },
        ].map((m) => (
          <div key={m.label} className="rounded-2xl bg-slate-50 p-3">
            <p className="text-slate-500">{m.label}</p>
            <p className="font-display text-lg font-bold">{m.value}</p>
          </div>
        ))}
      </div>
    </CardBody>
  </Card>
);

const AdminModelsPage = () => {
  useDocumentTitle('ML Models');
  const models = useModels();
  const train = useTrainModel();
  const activate = useActivateModel();
  const [source, setSource] = useState<TrainSource>('DATABASE');
  const [file, setFile] = useState<File | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <>
      <PageHeader eyebrow="Intelligence" title="ML Models" description="Train, compare and activate Linear Regression model versions." />
      <div className="space-y-6">
        <Card>
          <CardHeader title="Train a new model" description="A new version is created; activate it when you are happy with its metrics." />
          <CardBody>
            <div className="grid gap-3 md:grid-cols-3">
              {SOURCES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setSource(item.value)}
                  className={cn('rounded-2xl border p-4 text-left transition', source === item.value ? 'border-brand-700 bg-brand-50 ring-2 ring-brand-700/20' : 'border-slate-200 hover:border-brand-300')}
                >
                  <item.icon className="h-5 w-5 text-brand-700" />
                  <p className="mt-3 text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.text}</p>
                </button>
              ))}
            </div>
            {source === 'CSV' && (
              <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-600 hover:border-brand-400">
                <FileUp className="h-4 w-4 text-brand-700" />
                <span className="flex-1 truncate">{file ? file.name : 'Choose a CSV with the six feature columns and final_score'}</span>
                <input type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              </label>
            )}
            <Button className="mt-4" icon={<Cpu className="h-4 w-4" />} loading={train.isPending} disabled={source === 'CSV' && !file} onClick={() => train.mutate({ source, file: source === 'CSV' ? file : undefined })}>
              Train model
            </Button>
          </CardBody>
        </Card>

        <QueryView query={models}>
          {(data) => {
            const current = data.models.find((m) => m.id === selected) ?? data.active_model ?? data.models[0];
            return (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Kpi label="Model versions" value={data.models.length} tone="navy" icon={<Cpu className="h-4 w-4" />} />
                  <Kpi label="Active R²" value={data.active_model ? data.active_model.r2_score.toFixed(3) : '—'} tone="lime" />
                  <Kpi label="Active RMSE" value={data.active_model ? data.active_model.rmse.toFixed(2) : '—'} tone="sun" />
                </div>
                {data.models.length === 0 ? (
                  <EmptyState title="No models yet" description="Train your first model above to enable predictions." />
                ) : (
                  <>
                    <Card>
                      <CardHeader title="Version history" />
                      <DataTable
                        rows={data.models}
                        rowKey={(row) => row.id}
                        onRowClick={(row) => setSelected(row.id)}
                        columns={[
                          { key: 'name', header: 'Model', render: (row) => <div><p className="font-semibold text-slate-900">{row.name} v{row.version}</p><p className="text-[11px] text-slate-500">{row.algorithm}</p></div> },
                          { key: 'src', header: 'Source', render: (row) => row.data_source_display },
                          { key: 'rows', header: 'Rows', render: (row) => row.training_rows + row.test_rows },
                          { key: 'r2', header: 'R²', render: (row) => row.r2_score.toFixed(3) },
                          { key: 'rmse', header: 'RMSE', render: (row) => row.rmse.toFixed(2) },
                          { key: 'date', header: 'Trained', render: (row) => formatDate(row.created_at) },
                          {
                            key: 'act',
                            header: '',
                            className: 'text-right',
                            render: (row) =>
                              row.is_active ? (
                                <Badge tone="lime">Active</Badge>
                              ) : (
                                <span onClick={(e) => e.stopPropagation()}>
                                  <Button size="sm" variant="secondary" icon={<Power className="h-3.5 w-3.5" />} loading={activate.isPending && activate.variables === row.id} onClick={() => activate.mutate(row.id)}>
                                    Activate
                                  </Button>
                                </span>
                              ),
                          },
                        ]}
                      />
                    </Card>
                    {current && <ModelDetail model={current} />}
                  </>
                )}
              </>
            );
          }}
        </QueryView>
      </div>
    </>
  );
};

export default AdminModelsPage;

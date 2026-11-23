import { BrainCircuit } from 'lucide-react';
import { Card, CardBody, CardHeader, EmptyState } from '@/components/ui';
import { ScoreGauge } from '@/components/charts/ScoreGauge';
import { formatDate, formatNumber, humanize } from '@/lib/utils/format';
import { IndicatorBadge } from '@/features/performance/components/IndicatorBadge';
import { FEATURE_KEYS, FEATURE_META } from '../constants';
import type { Prediction } from '../types';

export const PredictionCard = ({ prediction, title = 'Performance prediction' }: { prediction: Prediction | null; title?: string }) => (
  <Card>
    <CardHeader icon={<BrainCircuit className="h-4 w-4" />} title={title} description={prediction?.created_at ? `Generated ${formatDate(prediction.created_at, true)}` : 'Linear Regression model'} />
    {prediction ? (
      <CardBody className="grid gap-6 md:grid-cols-[200px_1fr] md:items-center">
        <div className="flex flex-col items-center gap-3">
          <ScoreGauge score={prediction.predicted_score} label="Predicted final score" />
          <IndicatorBadge indicator={prediction.indicator} label={prediction.indicator_display} />
        </div>
        <div className="space-y-4">
          {prediction.features && (
            <dl className="grid grid-cols-2 gap-2 text-xs">
              {FEATURE_KEYS.filter((key) => prediction.features?.[key] !== undefined).map((key) => (
                <div key={key} className="rounded-xl bg-slate-50 px-3 py-2">
                  <dt className="text-slate-500">{FEATURE_META[key].label}</dt>
                  <dd className="font-bold text-slate-900">
                    {formatNumber(prediction.features?.[key], 0)}
                    {FEATURE_META[key].unit}
                  </dd>
                </div>
              ))}
            </dl>
          )}
          {prediction.contributions && prediction.contributions.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-bold text-slate-700">What drives this score</p>
              <ul className="space-y-1.5">
                {prediction.contributions.map((item) => (
                  <li key={item.feature} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">{item.label ?? humanize(item.feature)}</span>
                    <span className={(item.contribution ?? 0) >= 0 ? 'font-semibold text-emerald-600' : 'font-semibold text-rose-600'}>
                      {(item.contribution ?? 0) >= 0 ? '+' : ''}
                      {formatNumber(item.contribution ?? item.value, 2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {prediction.reasons && prediction.reasons.length > 0 && (
            <ul className="list-disc space-y-1 pl-4 text-xs text-amber-700">
              {prediction.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          )}
          <p className="text-[11px] text-slate-400">
            This prediction is an analytical aid and not a guarantee of your final result.
            {prediction.model_version ? ` Model ${prediction.model_version}.` : ''}
            {prediction.metrics?.r2 !== undefined ? ` R² ${formatNumber(prediction.metrics.r2, 3)}.` : ''}
          </p>
        </div>
      </CardBody>
    ) : (
      <EmptyState icon={<BrainCircuit className="h-6 w-6" />} title="No prediction yet" description="A prediction appears once enough attendance, assignment and test data is available." />
    )}
  </Card>
);

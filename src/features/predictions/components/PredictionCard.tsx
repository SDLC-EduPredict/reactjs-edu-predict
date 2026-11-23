import type { ReactNode } from 'react';
import { AlertCircle, BrainCircuit } from 'lucide-react';
import { ScoreGauge } from '@/components/charts/ScoreGauge';
import { IndicatorBadge } from '@/components/domain/IndicatorBadge';
import { Meter } from '@/components/domain/Metric';
import { formatDate, humanize } from '@/lib/utils/format';
import { FEATURE_KEYS, FEATURE_META } from '../constants';
import type { CoursePrediction } from '../types';

/** Navy “Linear Regression score forecast” card used by students and staff. */
export const PredictionCard = ({ item, action }: { item: CoursePrediction; action?: ReactNode }) => (
  <div className="navy-panel rounded-3xl p-6 text-white shadow-lift">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="flex items-center gap-1.5 text-xs font-semibold text-sun-300">
          <BrainCircuit className="h-3.5 w-3.5" /> Linear Regression Score Forecast
        </p>
        <h3 className="mt-1 font-display text-lg font-semibold">{item.course.title}</h3>
      </div>
      {item.prediction && <IndicatorBadge indicator={item.prediction.indicator} label={item.prediction.indicator_display} />}
    </div>
    <div className="mt-5 grid items-center gap-6 sm:grid-cols-[auto_1fr]">
      <div className="flex flex-col items-center rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
        <ScoreGauge dark score={item.prediction?.predicted_final_score} label="Predicted final score" size={170} />
        <p className="mt-1 text-[11px] text-white/50">{item.prediction ? `Updated ${formatDate(item.prediction.updated_at, true)}` : 'Not predicted yet'}</p>
      </div>
      <div className="space-y-3">
        {FEATURE_KEYS.map((key) => (
          <Meter key={key} dark label={FEATURE_META[key].label} value={item.features[key]} max={FEATURE_META[key].max} suffix={FEATURE_META[key].unit.trim()} />
        ))}
      </div>
    </div>
    {item.missing_features.length > 0 && (
      <p className="mt-4 flex items-start gap-2 rounded-xl bg-sun-300/10 p-3 text-xs text-sun-200">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> Missing data: {item.missing_features.map(humanize).join(', ')}. The forecast becomes more accurate as these are recorded.
      </p>
    )}
    {item.prediction?.model_version && (
      <p className="mt-3 text-[11px] text-white/50">
        Model: {item.prediction.model_version.name} · R² {item.prediction.model_version.r2_score.toFixed(3)} · RMSE {item.prediction.model_version.rmse.toFixed(2)}
      </p>
    )}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

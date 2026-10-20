import { useState } from 'react';
import { RotateCcw, Sparkles, Wand2 } from 'lucide-react';
import { Button, Card, CardBody, CardHeader } from '@/components/ui';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { FEATURE_KEYS, FEATURE_META } from '../constants';
import { usePredict } from '../hooks/usePredictions';
import { featureChanged, featuresLoaded, featuresReset, selectSimulator } from '../store/predictionSlice';
import type { PredictionFeatures } from '../types';

interface WhatIfSimulatorProps {
  currentFeatures?: Partial<PredictionFeatures> | null;
  studentId?: number;
}

export const WhatIfSimulator = ({ currentFeatures, studentId }: WhatIfSimulatorProps) => {
  const dispatch = useAppDispatch();
  const features = useAppSelector(selectSimulator);
  const predict = usePredict();
  const [mode, setMode] = useState<'records' | 'what-if'>('what-if');
  const run = (next: 'records' | 'what-if') => {
    setMode(next);
    predict.mutate(next === 'records' && studentId !== undefined ? { student_id: studentId } : { ...features });
  };

  return (
    <Card>
      <CardHeader
        icon={<Wand2 className="h-4 w-4" />}
        title="What-if simulator"
        description="Adjust the inputs to see how they change the predicted final score."
        action={
          <div className="flex gap-2">
            {currentFeatures && (
              <Button size="sm" variant="secondary" onClick={() => dispatch(featuresLoaded(currentFeatures))}>
                Use my current data
              </Button>
            )}
            <Button size="sm" variant="ghost" icon={<RotateCcw className="h-3.5 w-3.5" />} onClick={() => dispatch(featuresReset())}>
              Reset
            </Button>
          </div>
        }
      />
      <CardBody className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          {FEATURE_KEYS.map((key) => {
            const meta = FEATURE_META[key];
            return (
              <label key={key} className="block">
                <span className="mb-1.5 flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">{meta.label}</span>
                  <span className="font-bold text-brand-700">
                    {features[key]}
                    {meta.unit}
                  </span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={meta.max}
                  step={meta.step}
                  value={features[key]}
                  onChange={(event) => dispatch(featureChanged({ key, value: Number(event.target.value) }))}
                  className="w-full accent-brand-600"
                />
              </label>
            );
          })}
        </div>
        <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
          {studentId !== undefined && (
            <Button variant="outline" loading={predict.isPending && mode === 'records'} onClick={() => run('records')}>
              Generate from my records
            </Button>
          )}
          <Button icon={<Sparkles className="h-4 w-4" />} loading={predict.isPending && mode === 'what-if'} onClick={() => run('what-if')}>
            Predict with these values
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

import { Meter } from './Metric';

export const MlPreviewCard = () => (
  <div className="navy-panel rounded-3xl p-6 text-white shadow-lift">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-semibold text-sun-300">Live ML Engine Preview</p>
        <p className="mt-1 font-display text-lg font-semibold">Linear Regression Score Forecast</p>
      </div>
      <span className="rounded-full bg-lime-brand px-2.5 py-1 text-[10px] font-bold text-brand-950">Sample: Rahul Sen</span>
    </div>
    <div className="mt-5 flex items-end justify-between rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
      <div>
        <p className="text-[11px] text-white/60">Predicted Final Academic Score</p>
        <p className="mt-1 font-display text-4xl font-bold text-sun-300">
          66.6 <span className="text-base text-white/50">/ 100</span>
        </p>
      </div>
      <div className="text-right">
        <span className="rounded-full bg-lime-soft px-2.5 py-1 text-[10px] font-bold text-lime-ink">● Average Standing</span>
        <p className="mt-2 text-[11px] text-white/60">Track: Python + Django</p>
      </div>
    </div>
    <div className="mt-5 space-y-4">
      <Meter dark label="Attendance Percentage" value={90} suffix="%" />
      <Meter dark label="Assignment Average" value={80} />
      <Meter dark label="Mock Test Average" value={86} />
      <Meter dark label="Practice Hours / Week" value={14} max={20} suffix="hrs / wk" />
    </div>
  </div>
);

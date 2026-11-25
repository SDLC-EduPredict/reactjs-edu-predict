import { Globe2, Video } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import studentImage from '@/assets/figma/hero-student.png';

const AVATARS = [
  { initials: 'AS', className: 'bg-sun-300 text-brand-900' },
  { initials: 'PR', className: 'bg-brand-200 text-brand-800' },
  { initials: 'NK', className: 'bg-rose-200 text-rose-800' },
];

/** 90% semicircle gauge used on the floating “Satisfaction Rate” card. */
const SatisfactionGauge = () => (
  <svg viewBox="0 0 100 56" className="h-12 w-24" aria-hidden="true">
    <path
      d="M8 50 A42 42 0 0 1 92 50"
      fill="none"
      stroke="#eef0f6"
      strokeWidth="9"
      strokeLinecap="round"
    />
    <path
      d="M8 50 A42 42 0 0 1 92 50"
      fill="none"
      stroke="#c6e86b"
      strokeWidth="9"
      strokeLinecap="round"
      strokeDasharray="132 200"
      pathLength={147}
    />
  </svg>
);

/**
 * Figma hero artwork (Home + About): the transparent HD student cut-out on a lavender panel,
 * with the floating satisfaction, video and “50,000+ students” cards around it.
 */
export const StudentShowcase = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'relative mx-auto w-full max-w-md animate-slide-from-right pt-10 lg:max-w-none',
      className,
    )}
  >
    <div className="group relative ml-auto w-[82%] overflow-hidden rounded-[1.75rem] bg-[#f0eefc]">
      <img
        src={studentImage}
        alt="Smiling EDU-PREDICT student holding a laptop"
        width={1315}
        height={1500}
        fetchPriority="high"
        className="relative z-0 mx-auto w-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
      />
    </div>
    <div className="absolute left-0 top-0 z-10 flex animate-float flex-col items-center rounded-2xl bg-white px-4 py-3 shadow-lift ring-1 ring-black/5 sm:left-2">
      <SatisfactionGauge />
      <p className="-mt-6 font-display text-lg font-bold text-slate-900">90%</p>
      <p className="text-[11px] text-slate-500">Satisfaction Rate</p>
    </div>
    <span className="absolute -right-2 top-6 z-10 flex h-12 w-12 animate-float items-center justify-center rounded-full bg-pink-200 text-slate-900 shadow-md [animation-delay:-2s]">
      <Video className="h-5 w-5" />
    </span>
    <div className="absolute -bottom-6 right-0 z-10 w-56 animate-float rounded-2xl bg-white p-4 shadow-lift ring-1 ring-black/5 [animation-delay:-4s] sm:-right-4">
      <div className="flex -space-x-2">
        {AVATARS.map((avatar) => (
          <span
            key={avatar.initials}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold ring-2 ring-white',
              avatar.className,
            )}
          >
            {avatar.initials}
          </span>
        ))}
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lime-brand text-brand-950 ring-2 ring-white">
          <Globe2 className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-500">
        More than 50,000+ students enrolled around the world.
      </p>
    </div>
  </div>
);

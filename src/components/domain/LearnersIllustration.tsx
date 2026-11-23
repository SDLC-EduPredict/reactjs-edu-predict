import { BookOpen, Headphones, Laptop, MessageCircle, Play, Smartphone, Sparkles, Star } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const Bubble = ({ className, color, children }: { className: string; color: string; children: React.ReactNode }) => (
  <div className={cn('absolute flex items-center justify-center rounded-full shadow-lg ring-8 ring-white', className)} style={{ background: color }}>
    {children}
  </div>
);

const Person = ({ skin, hair, shirt, icon }: { skin: string; hair: string; shirt: string; icon: React.ReactNode }) => (
  <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
    <circle cx="60" cy="46" r="20" fill={skin} />
    <path d="M38 44c0-16 10-24 22-24s22 8 22 22c-6-6-16-9-26-8-8 1-14 5-18 10z" fill={hair} />
    <path d="M22 120c2-26 18-40 38-40s36 14 38 40z" fill={shirt} />
    <g transform="translate(70 70)">
      <rect width="30" height="30" rx="8" fill="#ffffff" opacity="0.95" />
      <foreignObject x="5" y="5" width="20" height="20">{icon}</foreignObject>
    </g>
  </svg>
);

export const LearnersIllustration = ({ className }: { className?: string }) => (
  <div className={cn('relative mx-auto aspect-square w-full max-w-[420px]', className)} aria-hidden="true">
    <Bubble className="left-[4%] top-[18%] h-[46%] w-[46%] overflow-hidden" color="#3b6fd4">
      <Person skin="#f2c6a0" hair="#2b1d16" shirt="#1a1f71" icon={<Headphones className="h-5 w-5 text-brand-700" />} />
    </Bubble>
    <Bubble className="right-[6%] top-[4%] h-[42%] w-[42%] overflow-hidden" color="#f9d56e">
      <Person skin="#e7b48d" hair="#4a2c1d" shirt="#9fd356" icon={<Smartphone className="h-5 w-5 text-brand-700" />} />
    </Bubble>
    <Bubble className="bottom-[4%] left-[26%] h-[40%] w-[40%] overflow-hidden" color="#c7d2fe">
      <Person skin="#d9a37c" hair="#1f1512" shirt="#f43f5e" icon={<BookOpen className="h-5 w-5 text-brand-700" />} />
    </Bubble>
    <Bubble className="bottom-[14%] right-[2%] h-[38%] w-[38%] overflow-hidden" color="#a7f3d0">
      <Person skin="#f0c19a" hair="#3a2a20" shirt="#1a1f71" icon={<Laptop className="h-5 w-5 text-brand-700" />} />
    </Bubble>
    <Bubble className="left-[46%] top-[36%] h-12 w-12" color="#ffffff">
      <Play className="h-5 w-5 fill-rose-500 text-rose-500" />
    </Bubble>
    <Bubble className="left-[10%] bottom-[16%] h-10 w-10" color="#e0e7ff">
      <MessageCircle className="h-4 w-4 text-brand-700" />
    </Bubble>
    <Bubble className="right-[44%] top-[6%] h-9 w-9" color="#fde68a">
      <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
    </Bubble>
    <Bubble className="right-[2%] top-[50%] h-9 w-9" color="#ede9fe">
      <Sparkles className="h-4 w-4 text-violet-600" />
    </Bubble>
  </div>
);

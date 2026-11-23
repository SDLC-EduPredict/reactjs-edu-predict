import type { ReactNode } from 'react';
import { GraduationCap } from 'lucide-react';

interface CtaBandProps {
  eyebrow?: string;
  title: ReactNode;
  description: string;
  action: ReactNode;
}

export const CtaBand = ({ eyebrow = 'Start Your Journey', title, description, action }: CtaBandProps) => (
  <section className="section-sun relative overflow-hidden py-20">
    <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/25 blur-2xl" />
    <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-sun-400/40 blur-2xl" />
    <div data-reveal="zoom" className="container-page relative flex flex-col items-center text-center">
      <span className="eyebrow mb-4 bg-white/80">
        <GraduationCap className="h-3.5 w-3.5" /> {eyebrow}
      </span>
      <h2 className="font-display text-3xl font-semibold text-slate-900 sm:text-4xl">{title}</h2>
      <p className="mt-3 max-w-xl text-sm text-slate-800">{description}</p>
      <div className="mt-7">{action}</div>
    </div>
  </section>
);

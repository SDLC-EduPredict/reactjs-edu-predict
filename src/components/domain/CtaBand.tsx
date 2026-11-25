import type { ReactNode } from 'react';
import { GraduationCap } from 'lucide-react';

interface CtaBandProps {
  eyebrow?: string;
  title: ReactNode;
  description: string;
  action: ReactNode;
}

export const CtaBand = ({ eyebrow = 'Start Your Journey', title, description, action }: CtaBandProps) => (
  <section className="section-sun py-20">
    <div data-reveal="zoom" className="container-page flex flex-col items-center text-center">
      <span className="eyebrow mb-5 bg-white">
        <GraduationCap className="h-3.5 w-3.5" /> {eyebrow}
      </span>
      <h2 className="font-display text-3xl font-semibold text-slate-900 sm:text-[2.75rem] sm:leading-tight">{title}</h2>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-800 sm:text-base">{description}</p>
      <div className="mt-8">{action}</div>
    </div>
  </section>
);

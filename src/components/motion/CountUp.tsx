import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  /** Any value; numbers inside strings such as "85%" or "72.4" are animated, the rest is kept. */
  value: string | number;
  duration?: number;
  className?: string;
}

const NUMBER = /-?\d[\d,]*(\.\d+)?/;

/** Counts from 0 to the value once it scrolls into view. Non-numeric values render unchanged. */
export const CountUp = ({ value, duration = 1100, className }: CountUpProps) => {
  const text = String(value);
  const match = text.match(NUMBER);
  const ref = useRef<HTMLSpanElement>(null);
  const [frameText, setFrameText] = useState<string | null>(match ? text.replace(NUMBER, '0') : null);

  useEffect(() => {
    if (!match) return;
    const target = Number(match[0].replace(/,/g, ''));
    const decimals = match[1] ? match[1].length - 1 : 0;
    const grouped = match[0].includes(',');
    const format = (n: number) => {
      const fixed = n.toFixed(decimals);
      return text.replace(NUMBER, grouped ? Number(fixed).toLocaleString('en-IN', { minimumFractionDigits: decimals }) : fixed);
    };
    const el = ref.current;
    let frame = 0;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      frame = requestAnimationFrame(() => setFrameText(null));
      return () => cancelAnimationFrame(frame);
    }
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        setFrameText(progress >= 1 ? null : format(target * eased));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        run();
        observer.disconnect();
      }
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-run only when the rendered value changes
  }, [text, duration]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{frameText ?? text}</span>
    </span>
  );
};

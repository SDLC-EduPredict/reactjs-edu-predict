import { useEffect, useRef, useState } from 'react';

/** Becomes true the first time the element scrolls into view (used for bar/number entrance animations). */
export const useInView = <T extends Element>(options: IntersectionObserverInit = { threshold: 0.2 }) => {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (!('IntersectionObserver' in window)) {
      const frame = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- options are static per call site
  }, [inView]);
  return [ref, inView] as const;
};

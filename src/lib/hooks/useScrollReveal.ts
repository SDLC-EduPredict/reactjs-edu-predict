import type { CSSProperties } from 'react';
import { useEffect, type RefObject } from 'react';

/**
 * Reveals every `[data-reveal]` element inside `rootRef` as it scrolls into view.
 * A MutationObserver picks up content that renders later (e.g. after an API call),
 * and `key` (usually the pathname) restarts the observers on navigation.
 */
export const useScrollReveal = (rootRef: RefObject<HTMLElement | null>, key: string) => {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reveal = (el: Element) => el.classList.add('is-revealed');

    if (reduceMotion || !('IntersectionObserver' in window)) {
      root.querySelectorAll('[data-reveal]').forEach(reveal);
      return;
    }

    const intersection = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            intersection.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );

    const scan = () => root.querySelectorAll('[data-reveal]:not(.is-revealed)').forEach((el) => intersection.observe(el));
    scan();
    const mutations = new MutationObserver(scan);
    mutations.observe(root, { childList: true, subtree: true });

    return () => {
      intersection.disconnect();
      mutations.disconnect();
    };
  }, [rootRef, key]);
};

/** Spread onto list items to stagger their reveal: `{...revealStagger(index)}`. */
export const revealStagger = (index: number, step = 80, mode: 'up' | 'left' | 'right' | 'zoom' = 'up') => ({
  'data-reveal': mode === 'up' ? '' : mode,
  style: { '--reveal-delay': `${Math.min(index, 8) * step}ms` } as CSSProperties,
});

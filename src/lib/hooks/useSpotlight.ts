import { useEffect } from 'react';

/** Feeds the pointer position to `.navy-panel` cards so their spotlight follows the cursor. */
export const useSpotlight = () => {
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const panel = (event.target as Element | null)?.closest?.('.navy-panel') as HTMLElement | null;
        if (!panel) return;
        const rect = panel.getBoundingClientRect();
        panel.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
        panel.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
      });
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('pointermove', onMove);
    };
  }, []);
};

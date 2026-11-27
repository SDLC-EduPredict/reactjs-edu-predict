import { useSyncExternalStore } from 'react';

/** What the visitor picked in the navbar. `system` follows the OS light/dark setting. */
export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'edu-predict-theme';
const media = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null;
const listeners = new Set<() => void>();

const readPreference = (): ThemePreference => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  } catch {
    return 'system';
  }
};

let preference: ThemePreference = readPreference();

const resolve = (value: ThemePreference): ResolvedTheme =>
  value === 'system' ? (media?.matches ? 'dark' : 'light') : value;

/** Puts the `dark` class on <html> so the dark palette in styles/theme.css applies. */
const apply = () => {
  const resolved = resolve(preference);
  const root = document.documentElement;
  root.classList.toggle('dark', resolved === 'dark');
  root.style.colorScheme = resolved;
};

const emit = () => listeners.forEach((listener) => listener());

/** Runs once before React renders, so the page never flashes the wrong theme. */
export const initTheme = () => {
  apply();
  media?.addEventListener('change', () => {
    if (preference !== 'system') return;
    apply();
    emit();
  });
  // Keep several open tabs in sync.
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return;
    preference = readPreference();
    apply();
    emit();
  });
};

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

/**
 * Switches theme. When the browser supports View Transitions the new theme is revealed as a
 * circle growing out of the button that was clicked.
 */
export const setThemePreference = (next: ThemePreference, origin?: { x: number; y: number }) => {
  if (next === preference) return;
  const before = resolve(preference);
  const update = () => {
    preference = next;
    try {
      if (next === 'system') localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage blocked (private mode): the choice still applies for this visit */
    }
    apply();
    emit();
  };

  const doc = document as ViewTransitionDocument;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!doc.startViewTransition || reduceMotion || resolve(next) === before) {
    update();
    return;
  }
  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? 0;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  document.documentElement.classList.add('theme-transition');
  const transition = doc.startViewTransition(update);
  void transition.ready
    .then(() =>
      document.documentElement
        .animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 550, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' },
        )
        .finished.catch(() => undefined),
    )
    .finally(() => document.documentElement.classList.remove('theme-transition'));
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** Current preference plus the theme actually showing, kept in sync with the OS setting. */
export const useTheme = () => {
  const current = useSyncExternalStore(subscribe, () => preference, () => 'system' as ThemePreference);
  const isDark = useSyncExternalStore(
    subscribe,
    () => resolve(preference) === 'dark',
    () => false,
  );
  return { preference: current, resolved: (isDark ? 'dark' : 'light') as ResolvedTheme, setPreference: setThemePreference };
};

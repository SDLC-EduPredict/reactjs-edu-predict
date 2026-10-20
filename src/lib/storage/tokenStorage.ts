import { env } from '@/config/env';
import type { AuthUser } from '@/types';

export interface PersistedAuth {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
}

const EMPTY: PersistedAuth = { accessToken: null, refreshToken: null, user: null };

export const tokenStorage = {
  load(): PersistedAuth {
    try {
      const raw = localStorage.getItem(env.authStorageKey);
      if (!raw) return EMPTY;
      const parsed = JSON.parse(raw) as Partial<PersistedAuth>;
      return {
        accessToken: parsed.accessToken ?? null,
        refreshToken: parsed.refreshToken ?? null,
        user: parsed.user ?? null,
      };
    } catch {
      return EMPTY;
    }
  },
  save(value: PersistedAuth): void {
    try {
      localStorage.setItem(env.authStorageKey, JSON.stringify(value));
    } catch {
      return;
    }
  },
  clear(): void {
    try {
      localStorage.removeItem(env.authStorageKey);
    } catch {
      return;
    }
  },
};

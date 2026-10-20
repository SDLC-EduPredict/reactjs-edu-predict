import { ApiError } from '@/lib/api/apiError';
import { isRecord } from '@/lib/api/normalize';
import type { AuthUser } from '@/types';

export interface NormalizedAuth {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: AuthUser | null;
}

const pickString = (source: Record<string, unknown>, keys: readonly string[]): string | undefined => {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'string' && value) return value;
  }
  return undefined;
};

const layers = (body: unknown): Record<string, unknown>[] => {
  const found: Record<string, unknown>[] = [];
  const visit = (value: unknown, depth: number) => {
    if (!isRecord(value) || depth > 3) return;
    found.push(value);
    ['data', 'tokens', 'token', 'result'].forEach((key) => visit(value[key], depth + 1));
  };
  visit(body, 0);
  return found;
};

const isUser = (value: unknown): value is AuthUser => isRecord(value) && typeof value.role === 'string';

export const normalizeAuthResponse = (body: unknown): NormalizedAuth => {
  const all = layers(body);
  const accessToken = all.map((layer) => pickString(layer, ['access_token', 'access', 'accessToken'])).find(Boolean);
  const refreshToken = all.map((layer) => pickString(layer, ['refresh_token', 'refresh', 'refreshToken'])).find(Boolean);
  const rawUser = all.map((layer) => layer.user).find(isUser);
  const message = (isRecord(body) && typeof body.message === 'string' && body.message) || 'Login successful';

  if (!accessToken || !refreshToken) {
    const errors = isRecord(body) && isRecord(body.errors) ? (body.errors as Record<string, string[] | string>) : {};
    throw new ApiError(
      isRecord(body) && typeof body.message === 'string' ? body.message : 'The server did not return login tokens.',
      isRecord(body) && typeof body.status_code === 'number' ? body.status_code : 0,
      errors,
    );
  }

  const user = rawUser
    ? { ...rawUser, role: rawUser.role.toUpperCase().replace(/\s+/g, '_') as AuthUser['role'], permissions: Array.isArray(rawUser.permissions) ? rawUser.permissions : [] }
    : null;
  return { message, accessToken, refreshToken, user };
};

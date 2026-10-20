const toNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const stripTrailingSlash = (value: string): string => value.replace(/\/+$/, '');

export const API_BASE_URL = stripTrailingSlash(
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
);

export const MEDIA_BASE_URL = stripTrailingSlash(import.meta.env.VITE_MEDIA_BASE_URL || API_BASE_URL);

export const env = {
  appName: import.meta.env.VITE_APP_NAME || 'EDU-PREDICT',
  appTagline:
    import.meta.env.VITE_APP_TAGLINE || 'AI-Based Student Performance & Academic Management System',
  instituteName: import.meta.env.VITE_INSTITUTE_NAME || 'ABC Academy',
  appEnv: import.meta.env.VITE_APP_ENV || 'development',
  apiBaseUrl: API_BASE_URL,
  mediaBaseUrl: MEDIA_BASE_URL,
  apiTimeoutMs: toNumber(import.meta.env.VITE_API_TIMEOUT_MS, 20000),
  authStorageKey: import.meta.env.VITE_AUTH_STORAGE_KEY || 'edu_predict_auth',
  tokenType: import.meta.env.VITE_TOKEN_TYPE || 'Bearer',
  defaultPageSize: toNumber(import.meta.env.VITE_DEFAULT_PAGE_SIZE, 10),
  queryStaleTimeMs: toNumber(import.meta.env.VITE_QUERY_STALE_TIME_MS, 30000),
  queryRetryCount: Number(import.meta.env.VITE_QUERY_RETRY_COUNT ?? 1),
  notificationPollIntervalMs: toNumber(import.meta.env.VITE_NOTIFICATION_POLL_INTERVAL_MS, 60000),
  enableQueryDevtools: import.meta.env.VITE_ENABLE_QUERY_DEVTOOLS === 'true',
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || 'admissions@abcacademy.edu',
  contactPhone: import.meta.env.VITE_CONTACT_PHONE || '+91 98300 12345',
  contactAddress:
    import.meta.env.VITE_CONTACT_ADDRESS || 'Sector V, Salt Lake City, Kolkata, WB 700091',
} as const;

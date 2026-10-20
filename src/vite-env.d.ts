/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_TAGLINE: string;
  readonly VITE_INSTITUTE_NAME: string;
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production';
  readonly VITE_API_BASE_URL: string;
  readonly VITE_MEDIA_BASE_URL: string;
  readonly VITE_API_TIMEOUT_MS: string;
  readonly VITE_AUTH_STORAGE_KEY: string;
  readonly VITE_TOKEN_TYPE: string;
  readonly VITE_DEFAULT_PAGE_SIZE: string;
  readonly VITE_QUERY_STALE_TIME_MS: string;
  readonly VITE_QUERY_RETRY_COUNT: string;
  readonly VITE_NOTIFICATION_POLL_INTERVAL_MS: string;
  readonly VITE_ENABLE_QUERY_DEVTOOLS: string;
  readonly VITE_CONTACT_EMAIL: string;
  readonly VITE_CONTACT_PHONE: string;
  readonly VITE_CONTACT_ADDRESS: string;
  readonly VITE_DEV_HOST: string;
  readonly VITE_DEV_PORT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

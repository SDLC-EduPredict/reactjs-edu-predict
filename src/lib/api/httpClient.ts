import axios, { AxiosHeaders, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, env } from '@/config/env';
import type { AppDispatch, RootState } from '@/app/store/store';
import { sessionExpired, tokensRefreshed } from '@/features/auth/store/authSlice';
import type { RefreshResponse } from '@/features/auth/types';
import { ENDPOINTS } from './endpoints';

interface StoreLike {
  getState: () => RootState;
  dispatch: AppDispatch;
}

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let storeRef: StoreLike | null = null;
let refreshPromise: Promise<string | null> | null = null;

export const injectStore = (store: StoreLike): void => {
  storeRef = store;
};

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: env.apiTimeoutMs,
  headers: { Accept: 'application/json' },
});

const PUBLIC_AUTH_PATHS: readonly string[] = [
  ENDPOINTS.auth.login,
  ENDPOINTS.auth.refresh,
  ENDPOINTS.auth.register,
  ENDPOINTS.auth.forgotPassword,
  ENDPOINTS.auth.resetPassword,
  ENDPOINTS.auth.verifyEmailOtp,
  ENDPOINTS.auth.verifyPhoneOtp,
];

const isPublicAuthRequest = (url?: string): boolean =>
  Boolean(url && PUBLIC_AUTH_PATHS.some((path) => url.endsWith(path)));

http.interceptors.request.use((config) => {
  const token = storeRef?.getState().auth.accessToken;
  const headers = AxiosHeaders.from(config.headers);
  if (token && !headers.has('Authorization') && !isPublicAuthRequest(config.url)) {
    headers.set('Authorization', `${env.tokenType} ${token}`);
  }
  config.headers = headers;
  return config;
});

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = storeRef?.getState().auth.refreshToken;
  if (!refreshToken) return null;
  try {
    const { data } = await axios.post<RefreshResponse>(
      `${API_BASE_URL}${ENDPOINTS.auth.refresh}`,
      { refresh_token: refreshToken },
      { timeout: env.apiTimeoutMs },
    );
    storeRef?.dispatch(
      tokensRefreshed({ accessToken: data.access_token, refreshToken: data.refresh_token }),
    );
    return data.access_token;
  } catch {
    return null;
  }
};

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;
    if (!original || status !== 401 || original._retry || isPublicAuthRequest(original.url)) {
      return Promise.reject(error);
    }
    if (!storeRef?.getState().auth.refreshToken) return Promise.reject(error);

    original._retry = true;
    refreshPromise ??= refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
    const newToken = await refreshPromise;

    if (!newToken) {
      storeRef?.dispatch(sessionExpired());
      return Promise.reject(error);
    }
    const headers = AxiosHeaders.from(original.headers);
    headers.set('Authorization', `${env.tokenType} ${newToken}`);
    original.headers = headers;
    return http(original);
  },
);

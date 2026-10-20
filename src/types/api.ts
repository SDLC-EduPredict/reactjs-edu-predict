export type ApiFieldErrors = Record<string, string[] | string>;

export interface ApiEnvelope<T> {
  status: 'success' | 'error' | (string & {});
  status_code: number;
  message: string;
  data: T;
  errors: ApiFieldErrors | null;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ListParams {
  page?: number;
  page_size?: number;
  search?: string;
}

export type QueryParams = Record<string, string | number | boolean | null | undefined>;

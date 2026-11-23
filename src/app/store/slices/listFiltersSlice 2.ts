import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { env } from '@/config/env';
import type { RootState } from '../store';

export interface ListFilterState {
  search: string;
  page: number;
  pageSize: number;
  filters: Record<string, string>;
}

export type ListFiltersState = Record<string, ListFilterState>;

export const createDefaultListFilter = (): ListFilterState => ({
  search: '',
  page: 1,
  pageSize: env.defaultPageSize,
  filters: {},
});

const ensure = (state: ListFiltersState, key: string): ListFilterState => {
  state[key] ??= createDefaultListFilter();
  return state[key];
};

const listFiltersSlice = createSlice({
  name: 'listFilters',
  initialState: {} as ListFiltersState,
  reducers: {
    searchChanged(state, action: PayloadAction<{ key: string; search: string }>) {
      const entry = ensure(state, action.payload.key);
      entry.search = action.payload.search;
      entry.page = 1;
    },
    pageChanged(state, action: PayloadAction<{ key: string; page: number }>) {
      ensure(state, action.payload.key).page = action.payload.page;
    },
    filterChanged(state, action: PayloadAction<{ key: string; name: string; value: string }>) {
      const entry = ensure(state, action.payload.key);
      if (action.payload.value) entry.filters[action.payload.name] = action.payload.value;
      else delete entry.filters[action.payload.name];
      entry.page = 1;
    },
    filtersReset(state, action: PayloadAction<string>) {
      state[action.payload] = createDefaultListFilter();
    },
  },
});

const DEFAULT_FILTER = createDefaultListFilter();

export const selectListFilter = (key: string) => (state: RootState) =>
  state.listFilters[key] ?? DEFAULT_FILTER;

export const { searchChanged, pageChanged, filterChanged, filtersReset } =
  listFiltersSlice.actions;
export default listFiltersSlice.reducer;

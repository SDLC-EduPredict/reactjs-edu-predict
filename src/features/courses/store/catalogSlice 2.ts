import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store/store';
import type { CourseLevel, CourseMode } from '../types';

export interface CatalogFilters {
  search: string;
  category: string;
  level: CourseLevel | '';
  mode: CourseMode | '';
  page: number;
}

export interface CatalogState {
  filters: CatalogFilters;
  view: 'grid' | 'list';
}

const initialState: CatalogState = {
  filters: { search: '', category: '', level: '', mode: '', page: 1 },
  view: 'grid',
};

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    catalogSearchChanged(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
      state.filters.page = 1;
    },
    catalogCategoryChanged(state, action: PayloadAction<string>) {
      state.filters.category = action.payload;
      state.filters.page = 1;
    },
    catalogLevelChanged(state, action: PayloadAction<CatalogFilters['level']>) {
      state.filters.level = action.payload;
      state.filters.page = 1;
    },
    catalogModeChanged(state, action: PayloadAction<CatalogFilters['mode']>) {
      state.filters.mode = action.payload;
      state.filters.page = 1;
    },
    catalogPageChanged(state, action: PayloadAction<number>) {
      state.filters.page = action.payload;
    },
    catalogViewChanged(state, action: PayloadAction<CatalogState['view']>) {
      state.view = action.payload;
    },
    catalogFiltersReset(state) {
      state.filters = initialState.filters;
    },
  },
});

export const selectCatalogFilters = (state: RootState) => state.catalog.filters;
export const selectCatalogView = (state: RootState) => state.catalog.view;

export const {
  catalogSearchChanged,
  catalogCategoryChanged,
  catalogLevelChanged,
  catalogModeChanged,
  catalogPageChanged,
  catalogViewChanged,
  catalogFiltersReset,
} = catalogSlice.actions;
export default catalogSlice.reducer;

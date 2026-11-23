import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store/store';
import type { CourseLevel } from '../types';

export interface CatalogFilters {
  search: string;
  category: string;
  level: CourseLevel | '';
  page: number;
}

export interface FinderAnswers {
  goal: string;
  experience: string;
  hours: string;
}

export interface CatalogState {
  filters: CatalogFilters;
  previewSlug: string | null;
  finderOpen: boolean;
  finder: FinderAnswers;
  finderSubmitted: boolean;
}

const initialState: CatalogState = {
  filters: { search: '', category: '', level: '', page: 1 },
  previewSlug: null,
  finderOpen: false,
  finder: { goal: '', experience: 'BEGINNER', hours: '6-8' },
  finderSubmitted: false,
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
    catalogPageChanged(state, action: PayloadAction<number>) {
      state.filters.page = action.payload;
    },
    catalogFiltersReset(state) {
      state.filters = initialState.filters;
    },
    coursePreviewOpened(state, action: PayloadAction<string>) {
      state.previewSlug = action.payload;
    },
    coursePreviewClosed(state) {
      state.previewSlug = null;
    },
    finderToggled(state, action: PayloadAction<boolean>) {
      state.finderOpen = action.payload;
      if (!action.payload) state.finderSubmitted = false;
    },
    finderAnswerChanged(state, action: PayloadAction<{ key: keyof FinderAnswers; value: string }>) {
      state.finder[action.payload.key] = action.payload.value;
    },
    finderSubmitted(state, action: PayloadAction<boolean>) {
      state.finderSubmitted = action.payload;
    },
  },
});

export const selectCatalogFilters = (state: RootState) => state.catalog.filters;
export const selectCoursePreview = (state: RootState) => state.catalog.previewSlug;
export const selectFinder = (state: RootState) => state.catalog;

export const {
  catalogSearchChanged,
  catalogCategoryChanged,
  catalogLevelChanged,
  catalogPageChanged,
  catalogFiltersReset,
  coursePreviewOpened,
  coursePreviewClosed,
  finderToggled,
  finderAnswerChanged,
  finderSubmitted,
} = catalogSlice.actions;
export default catalogSlice.reducer;

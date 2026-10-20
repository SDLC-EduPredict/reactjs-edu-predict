import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  filterChanged,
  filtersReset,
  pageChanged,
  searchChanged,
  selectListFilter,
} from '@/app/store/slices/listFiltersSlice';
import { useDebouncedValue } from './useDebouncedValue';

export const useListFilter = (key: string) => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectListFilter(key));
  const debouncedSearch = useDebouncedValue(state.search);

  const setSearch = useCallback(
    (search: string) => dispatch(searchChanged({ key, search })),
    [dispatch, key],
  );
  const setPage = useCallback((page: number) => dispatch(pageChanged({ key, page })), [dispatch, key]);
  const setFilter = useCallback(
    (name: string, value: string) => dispatch(filterChanged({ key, name, value })),
    [dispatch, key],
  );
  const reset = useCallback(() => dispatch(filtersReset(key)), [dispatch, key]);

  return {
    ...state,
    debouncedSearch,
    params: {
      search: debouncedSearch,
      page: state.page,
      page_size: state.pageSize,
      ...state.filters,
    },
    setSearch,
    setPage,
    setFilter,
    reset,
  };
};

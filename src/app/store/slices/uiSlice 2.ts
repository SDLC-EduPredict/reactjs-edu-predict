import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

export interface UiState {
  toasts: Toast[];
  sidebarOpen: boolean;
  mobileNavOpen: boolean;
}

const initialState: UiState = {
  toasts: [],
  sidebarOpen: false,
  mobileNavOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toastAdded: {
      reducer(state, action: PayloadAction<Toast>) {
        state.toasts = [...state.toasts.slice(-3), action.payload];
      },
      prepare(toast: Omit<Toast, 'id'>) {
        return { payload: { ...toast, id: nanoid() } };
      },
    },
    toastDismissed(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    sidebarToggled(state, action: PayloadAction<boolean | undefined>) {
      state.sidebarOpen = action.payload ?? !state.sidebarOpen;
    },
    mobileNavToggled(state, action: PayloadAction<boolean | undefined>) {
      state.mobileNavOpen = action.payload ?? !state.mobileNavOpen;
    },
  },
});

export const { toastAdded, toastDismissed, sidebarToggled, mobileNavToggled } = uiSlice.actions;
export default uiSlice.reducer;

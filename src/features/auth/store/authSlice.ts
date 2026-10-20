import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { tokenStorage } from '@/lib/storage/tokenStorage';
import type { AuthUser } from '@/types';

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  sessionExpired: boolean;
}

const persisted = tokenStorage.load();

const initialState: AuthState = {
  accessToken: persisted.accessToken,
  refreshToken: persisted.refreshToken,
  user: persisted.user,
  sessionExpired: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    credentialsReceived(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string; user: AuthUser }>,
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.sessionExpired = false;
    },
    tokensRefreshed(state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    userUpdated(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },
    loggedOut(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.sessionExpired = false;
    },
    sessionExpired(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.sessionExpired = true;
    },
  },
});

export const { credentialsReceived, tokensRefreshed, userUpdated, loggedOut, sessionExpired } =
  authSlice.actions;

export default authSlice.reducer;

import { combineReducers, configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import authReducer, {
  credentialsReceived,
  loggedOut,
  sessionExpired,
  tokensRefreshed,
  userUpdated,
} from '@/features/auth/store/authSlice';
import catalogReducer from '@/features/courses/store/catalogSlice';
import predictionReducer from '@/features/predictions/store/predictionSlice';
import { tokenStorage } from '@/lib/storage/tokenStorage';
import uiReducer from './slices/uiSlice';
import listFiltersReducer from './slices/listFiltersSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  listFilters: listFiltersReducer,
  catalog: catalogReducer,
  prediction: predictionReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const authPersistence = createListenerMiddleware<RootState>();

authPersistence.startListening({
  matcher: isAnyOf(credentialsReceived, tokensRefreshed, userUpdated),
  effect: (_action, api) => {
    const { accessToken, refreshToken, user } = api.getState().auth;
    tokenStorage.save({ accessToken, refreshToken, user });
  },
});

authPersistence.startListening({
  matcher: isAnyOf(loggedOut, sessionExpired),
  effect: () => tokenStorage.clear(),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) => getDefault().prepend(authPersistence.middleware),
  devTools: import.meta.env.DEV,
});

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;

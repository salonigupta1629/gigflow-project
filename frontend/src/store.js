import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import gigReducer from './features/gigs/gigSlice';
import bidReducer from './features/bids/bidSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    gigs: gigReducer,
    bids: bidReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;

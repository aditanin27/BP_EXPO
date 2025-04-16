import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import childrenReducer from './slices/childrenSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    children: childrenReducer,
  },
});
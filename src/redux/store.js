import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import anakReducer from './slices/anakSlice';
import tutorReducer from './slices/tutorSlice';
import kelompokReducer from './slices/kelompokSlice';
import raportReducer from './slices/raportSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    anak: anakReducer,
    tutor: tutorReducer,
    kelompok: kelompokReducer,
    raport: raportReducer,
  },
});
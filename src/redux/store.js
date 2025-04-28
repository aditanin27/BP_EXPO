import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import anakReducer from './slices/anakSlice';
import tutorReducer from './slices/tutorSlice';
import kelompokReducer from './slices/kelompokSlice';
import raportReducer from './slices/raportSlice';
import prestasiReducer from './slices/prestasiSlice';
import suratAbReducer from './slices/suratAbSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    anak: anakReducer,
    tutor: tutorReducer,
    kelompok: kelompokReducer,
    raport: raportReducer,
    prestasi: prestasiReducer,
    suratAb: suratAbReducer,
  },
});
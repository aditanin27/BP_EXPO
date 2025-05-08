import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import anakReducer from './slices/anakSlice';
import tutorReducer from './slices/tutorSlice';
import kelompokReducer from './slices/kelompokSlice';
import raportReducer from './slices/raportSlice';
import prestasiReducer from './slices/prestasiSlice';
import suratAbReducer from './slices/suratAbSlice';
import historiReducer from './slices/historiSlice';
import keluargaReducer from './slices/keluargaSlice';
import aktivitasReducer from './slices/aktivitasSlice';
import absenReducer from './slices/absenSlice';
import SurveyReducer from './slices/surveySlice';

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
    histori: historiReducer,
    keluarga: keluargaReducer,
    aktivitas: aktivitasReducer,
    absen: absenReducer,
    survey: SurveyReducer,
  },
});
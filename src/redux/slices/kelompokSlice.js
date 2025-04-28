import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { kelompokApi } from '../../api';

export const fetchKelompok = createAsyncThunk(
  'kelompok/fetch',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await kelompokApi.getAll(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch kelompok');
    }
  }
);

export const fetchKelompokDetail = createAsyncThunk(
  'kelompok/fetchDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await kelompokApi.getById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch kelompok detail');
    }
  }
);

const kelompokSlice = createSlice({
  name: 'kelompok',
  initialState: {
    data: [],
    detail: null,
    pagination: null,
    summary: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    resetKelompokError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKelompok.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchKelompok.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
        state.pagination = action.payload.pagination;
        state.summary = action.payload.summary;
      })
      .addCase(fetchKelompok.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchKelompokDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchKelompokDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.detail = action.payload.data;
      })
      .addCase(fetchKelompokDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetKelompokError } = kelompokSlice.actions;
export default kelompokSlice.reducer;
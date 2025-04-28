import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tutorApi } from '../../api';

export const fetchTutors = createAsyncThunk(
  'tutor/fetch',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await tutorApi.getAll(params);
      return {
        data: response.data,
        pagination: response.pagination,
        summary: response.summary
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch tutors');
    }
  }
);

export const fetchTutorDetail = createAsyncThunk(
  'tutor/fetchDetail',
  async (tutorId, { rejectWithValue }) => {
    try {
      const response = await tutorApi.getById(tutorId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch tutor details');
    }
  }
);

const tutorSlice = createSlice({
  name: 'tutor',
  initialState: {
    data: [],
    detailData: null,
    pagination: {
      total: 0,
      per_page: 10,
      current_page: 1,
      last_page: 1,
      from: null,
      to: null
    },
    summary: {
      total_tutor: 0
    },
    isLoading: false,
    error: null
  },
  reducers: {
    resetTutorError: (state) => {
      state.error = null;
    },
    clearTutors: (state) => {
      state.data = [];
      state.pagination = {
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 1,
        from: null,
        to: null
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTutors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTutors.fulfilled, (state, action) => {
        const { data, pagination, summary } = action.payload;
        
        state.data = pagination.current_page === 1 
          ? data 
          : [...state.data, ...data];
        
        state.pagination = pagination;
        state.summary = summary;
        state.isLoading = false;
      })
      .addCase(fetchTutors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchTutorDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.detailData = null;
      })
      .addCase(fetchTutorDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.detailData = action.payload;
      })
      .addCase(fetchTutorDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.detailData = null;
      });
  }
});

export const { 
  resetTutorError, 
  clearTutors 
} = tutorSlice.actions;

export default tutorSlice.reducer;
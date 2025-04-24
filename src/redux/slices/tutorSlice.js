import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';

export const fetchTutors = createAsyncThunk(
  'tutor/fetch',
  async ({ page = 1, search = '' }, { rejectWithValue }) => {
    try {
      const response = await api.getTutors(page, search);
      
      if (response.success) {
        return {
          data: response.data,
          pagination: response.pagination,
          summary: response.summary
        };
      }
      
      return rejectWithValue(response.message || 'Failed to fetch tutors');
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch tutors');
    }
  }
);

const tutorSlice = createSlice({
  name: 'tutor',
  initialState: {
    data: [],
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
        
        // If it's the first page, replace the data
        // Otherwise, append the new data
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
      });
  }
});

export const { 
  resetTutorError, 
  clearTutors 
} = tutorSlice.actions;

export default tutorSlice.reducer;
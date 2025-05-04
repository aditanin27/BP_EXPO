// src/redux/slices/tutorSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tutorApi } from '../../api';

export const fetchTutors = createAsyncThunk(
  'tutor/fetchAll',
  async ({ page = 1, search = '', loadMore = false }, { rejectWithValue }) => {
    try {
      const response = await tutorApi.getAll({ page, search });
      return {
        data: response.data,
        pagination: response.pagination,
        loadMore
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch tutors');
    }
  }
);

export const fetchTutorById = createAsyncThunk(
  'tutor/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await tutorApi.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch tutor details');
    }
  }
);

export const createTutor = createAsyncThunk(
  'tutor/create',
  async (tutorData, { rejectWithValue }) => {
    try {
      const response = await tutorApi.create(tutorData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create tutor');
    }
  }
);

export const updateTutor = createAsyncThunk(
  'tutor/update',
  async ({ id, tutorData }, { rejectWithValue }) => {
    try {
      const response = await tutorApi.update(id, tutorData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update tutor');
    }
  }
);

export const deleteTutor = createAsyncThunk(
  'tutor/delete',
  async (id, { rejectWithValue }) => {
    try {
      await tutorApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete tutor');
    }
  }
);

const tutorSlice = createSlice({
  name: 'tutor',
  initialState: {
    list: [],
    selectedTutor: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 10,
      from: null,
      to: null
    },
    isLoading: false,
    isLoadingMore: false,
    error: null,
    createSuccess: false,
    updateSuccess: false,
    deleteSuccess: false
  },
  reducers: {
    resetTutorState: (state) => {
      state.error = null;
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },
    clearSelectedTutor: (state) => {
      state.selectedTutor = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all tutors
      .addCase(fetchTutors.pending, (state, action) => {
        if (action.meta.arg.loadMore) {
          state.isLoadingMore = true;
        } else {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchTutors.fulfilled, (state, action) => {
        const { data, pagination, loadMore } = action.payload;
        
        if (loadMore) {
          state.list = [...state.list, ...data];
          state.isLoadingMore = false;
        } else {
          state.list = data;
          state.isLoading = false;
        }
        
        state.pagination = pagination;
      })
      .addCase(fetchTutors.rejected, (state, action) => {
        if (action.meta.arg.loadMore) {
          state.isLoadingMore = false;
        } else {
          state.isLoading = false;
        }
        state.error = action.payload;
      })
      
      // Fetch tutor by ID
      .addCase(fetchTutorById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTutorById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedTutor = action.payload;
      })
      .addCase(fetchTutorById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create tutor
      .addCase(createTutor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createTutor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list.unshift(action.payload);
        state.createSuccess = true;
        state.pagination.total += 1;
      })
      .addCase(createTutor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })
      
      // Update tutor
      .addCase(updateTutor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateTutor.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.list.findIndex(tutor => tutor.id_tutor === action.payload.id_tutor);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.selectedTutor && state.selectedTutor.id_tutor === action.payload.id_tutor) {
          state.selectedTutor = action.payload;
        }
        state.updateSuccess = true;
      })
      .addCase(updateTutor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      
      // Delete tutor
      .addCase(deleteTutor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteTutor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = state.list.filter(tutor => tutor.id_tutor !== action.payload);
        state.pagination.total -= 1;
        if (state.selectedTutor && state.selectedTutor.id_tutor === action.payload) {
          state.selectedTutor = null;
        }
        state.deleteSuccess = true;
      })
      .addCase(deleteTutor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.deleteSuccess = false;
      });
  }
});

export const { resetTutorState, clearSelectedTutor } = tutorSlice.actions;
export default tutorSlice.reducer;
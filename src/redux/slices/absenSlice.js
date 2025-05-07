import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { absenApi } from '../../api';

export const fetchAbsenByAktivitas = createAsyncThunk(
  'absen/fetchByAktivitas',
  async (id_aktivitas, { rejectWithValue }) => {
    try {
      const response = await absenApi.getByAktivitas(id_aktivitas);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch absensi data');
    }
  }
);

export const submitAbsen = createAsyncThunk(
  'absen/submit',
  async ({ id_aktivitas, absenData }, { rejectWithValue }) => {
    try {
      const response = await absenApi.submitAbsen(id_aktivitas, absenData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to submit absensi data');
    }
  }
);

export const updateAbsenStatus = createAsyncThunk(
  'absen/updateStatus',
  async ({ id_aktivitas, id_anak, status_absen }, { rejectWithValue }) => {
    try {
      const response = await absenApi.updateAbsenStatus(id_aktivitas, id_anak, status_absen);
      return {
        id_anak,
        status_absen,
        data: response.data
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update absensi status');
    }
  }
);

export const fetchAvailableChildren = createAsyncThunk(
  'absen/fetchAvailableChildren',
  async (id_aktivitas, { rejectWithValue }) => {
    try {
      const response = await absenApi.getAvailableChildren(id_aktivitas);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch available children');
    }
  }
);

const absenSlice = createSlice({
  name: 'absen',
  initialState: {
    list: [],
    availableChildren: [],
    aktivitas: null,
    isLoading: false,
    isSubmitting: false,
    isUpdating: false,
    isLoadingChildren: false,
    error: null,
    submitSuccess: false,
    updateSuccess: false
  },
  reducers: {
    resetAbsenState: (state) => {
      state.error = null;
      state.submitSuccess = false;
      state.updateSuccess = false;
    },
    updateAbsenLocal: (state, action) => {
      const { id_anak, status_absen } = action.payload;
      const index = state.list.findIndex(item => item.id_anak === id_anak);
      
      if (index !== -1) {
        state.list[index].status_absen = status_absen;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch absen by aktivitas
      .addCase(fetchAbsenByAktivitas.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAbsenByAktivitas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.data || [];
        state.aktivitas = action.payload.aktivitas || null;
      })
      .addCase(fetchAbsenByAktivitas.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Submit absen
      .addCase(submitAbsen.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.submitSuccess = false;
      })
      .addCase(submitAbsen.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.submitSuccess = true;
        
        // Update the list if returned in the response
        if (action.payload.data) {
          state.list = action.payload.data;
        }
      })
      .addCase(submitAbsen.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
        state.submitSuccess = false;
      })
      
      // Update absen status
      .addCase(updateAbsenStatus.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateAbsenStatus.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.updateSuccess = true;
        
        // Update the specific child's attendance status in the list
        const { id_anak, status_absen } = action.payload;
        const index = state.list.findIndex(item => item.id_anak === id_anak);
        
        if (index !== -1) {
          state.list[index].status_absen = status_absen;
        }
      })
      .addCase(updateAbsenStatus.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      
      // Fetch available children
      .addCase(fetchAvailableChildren.pending, (state) => {
        state.isLoadingChildren = true;
        state.error = null;
      })
      .addCase(fetchAvailableChildren.fulfilled, (state, action) => {
        state.isLoadingChildren = false;
        state.availableChildren = action.payload;
      })
      .addCase(fetchAvailableChildren.rejected, (state, action) => {
        state.isLoadingChildren = false;
        state.error = action.payload;
      });
  }
});

export const { resetAbsenState, updateAbsenLocal } = absenSlice.actions;
export default absenSlice.reducer;
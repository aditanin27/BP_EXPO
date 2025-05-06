// src/redux/slices/absenSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { absenApi } from '../../api';

// Fetch absensi data by aktivitas ID
export const fetchAbsenByAktivitas = createAsyncThunk(
  'absen/fetchByAktivitas',
  async (id_aktivitas, { rejectWithValue }) => {
    try {
      const response = await absenApi.getByAktivitas(id_aktivitas);
      return {
        data: response.data,
        is_existing: response.is_existing,
        aktivitas: response.aktivitas
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch absensi data');
    }
  }
);

// Create new absensi records
export const createAbsen = createAsyncThunk(
  'absen/create',
  async ({ id_aktivitas, absen_data }, { rejectWithValue }) => {
    try {
      const response = await absenApi.create({ id_aktivitas, absen_data });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create absensi');
    }
  }
);

// Update existing absensi records
export const updateAbsen = createAsyncThunk(
  'absen/update',
  async ({ id_aktivitas, absen_data }, { rejectWithValue }) => {
    try {
      const response = await absenApi.update(id_aktivitas, { absen_data });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update absensi');
    }
  }
);

// Get summary of absensi data (optional)
export const fetchAbsenSummary = createAsyncThunk(
  'absen/fetchSummary',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await absenApi.getSummary(params);
      return {
        absen_summary: response.absen_summary,
        aktivitas_summary: response.aktivitas_summary,
        date_range: response.date_range
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch absensi summary');
    }
  }
);

const absenSlice = createSlice({
  name: 'absen',
  initialState: {
    absenList: [],
    isExisting: false,
    aktivitasDetails: null,
    absenSummary: null,
    aktivitasSummary: null,
    dateRange: null,
    
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isLoadingSummary: false,
    
    error: null,
    createSuccess: false,
    updateSuccess: false,
    
    // This is a working copy for the UI to track changes before submitting
    workingData: [] 
  },
  reducers: {
    resetAbsenState: (state) => {
      state.error = null;
      state.createSuccess = false;
      state.updateSuccess = false;
    },
    clearAbsenData: (state) => {
      state.absenList = [];
      state.isExisting = false;
      state.aktivitasDetails = null;
      state.workingData = [];
    },
    // Update local working data without API call
    updateAbsenWorkingData: (state, action) => {
      const { id_anak, status } = action.payload;
      
      // Find the record in working data
      const index = state.workingData.findIndex(item => item.id_anak === id_anak);
      
      if (index !== -1) {
        // Update existing record
        state.workingData[index].status_absen = status;
      } else {
        // Create new record in working data
        state.workingData.push({
          id_anak,
          status_absen: status
        });
      }
    },
    // Initialize working data based on absenList
    initializeWorkingData: (state) => {
      state.workingData = state.absenList.map(item => ({
        ...item,
        // If the record already exists, include the absen_id
        ...(state.isExisting && {
          id_absen: item.id_absen,
          id_absen_user: item.id_absen_user
        })
      }));
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchAbsenByAktivitas
      .addCase(fetchAbsenByAktivitas.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAbsenByAktivitas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.absenList = action.payload.data;
        state.isExisting = action.payload.is_existing;
        state.aktivitasDetails = action.payload.aktivitas;
        
        // Initialize working data with fetched data
        state.workingData = action.payload.data.map(item => ({
          ...item
        }));
      })
      .addCase(fetchAbsenByAktivitas.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // createAbsen
      .addCase(createAbsen.pending, (state) => {
        state.isCreating = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createAbsen.fulfilled, (state, action) => {
        state.isCreating = false;
        state.absenList = action.payload;
        state.isExisting = true;
        state.createSuccess = true;
        
        // Update working data with saved data
        state.workingData = action.payload.map(item => ({
          ...item
        }));
      })
      .addCase(createAbsen.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
        state.createSuccess = false;
      })
      
      // updateAbsen
      .addCase(updateAbsen.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateAbsen.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.absenList = action.payload;
        state.updateSuccess = true;
        
        // Update working data with saved data
        state.workingData = action.payload.map(item => ({
          ...item
        }));
      })
      .addCase(updateAbsen.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      
      // fetchAbsenSummary
      .addCase(fetchAbsenSummary.pending, (state) => {
        state.isLoadingSummary = true;
        state.error = null;
      })
      .addCase(fetchAbsenSummary.fulfilled, (state, action) => {
        state.isLoadingSummary = false;
        state.absenSummary = action.payload.absen_summary;
        state.aktivitasSummary = action.payload.aktivitas_summary;
        state.dateRange = action.payload.date_range;
      })
      .addCase(fetchAbsenSummary.rejected, (state, action) => {
        state.isLoadingSummary = false;
        state.error = action.payload;
      });
  }
});

export const { 
  resetAbsenState, 
  clearAbsenData, 
  updateAbsenWorkingData,
  initializeWorkingData
} = absenSlice.actions;

export default absenSlice.reducer;
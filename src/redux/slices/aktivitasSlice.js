import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { aktivitasApi } from '../../api';

export const fetchAktivitas = createAsyncThunk(
  'aktivitas/fetchAll',
  async ({ page = 1, search = '', id_shelter = '', jenis_kegiatan = '', loadMore = false }, { rejectWithValue }) => {
    try {
      const response = await aktivitasApi.getAll({ page, search, id_shelter, jenis_kegiatan });
      return {
        data: response.data,
        pagination: response.pagination,
        loadMore
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch aktivitas');
    }
  }
);

export const fetchAktivitasDetail = createAsyncThunk(
  'aktivitas/fetchDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await aktivitasApi.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch aktivitas details');
    }
  }
);

export const createAktivitas = createAsyncThunk(
  'aktivitas/create',
  async (aktivitasData, { rejectWithValue }) => {
    try {
      const response = await aktivitasApi.create(aktivitasData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create aktivitas');
    }
  }
);

export const updateAktivitas = createAsyncThunk(
  'aktivitas/update',
  async ({ id, aktivitasData }, { rejectWithValue }) => {
    try {
      const response = await aktivitasApi.update(id, aktivitasData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update aktivitas');
    }
  }
);

export const deleteAktivitas = createAsyncThunk(
  'aktivitas/delete',
  async (id, { rejectWithValue }) => {
    try {
      await aktivitasApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete aktivitas');
    }
  }
);

export const uploadFotoAktivitas = createAsyncThunk(
  'aktivitas/uploadFoto',
  async ({ id, photoData }, { rejectWithValue }) => {
    try {
      const response = await aktivitasApi.uploadFoto(id, photoData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upload photos');
    }
  }
);

const aktivitasSlice = createSlice({
  name: 'aktivitas',
  initialState: {
    list: [],
    detail: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 10,
      from: null,
      to: null
    },
    isLoading: false,
    isLoadingDetail: false,
    isLoadingMore: false,
    isUploading: false,
    error: null,
    createSuccess: false,
    updateSuccess: false,
    deleteSuccess: false,
    uploadSuccess: false
  },
  reducers: {
    resetAktivitasState: (state) => {
      state.error = null;
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
      state.uploadSuccess = false;
    },
    clearAktivitasDetail: (state) => {
      state.detail = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch aktivitas
      .addCase(fetchAktivitas.pending, (state, action) => {
        if (action.meta.arg.loadMore) {
          state.isLoadingMore = true;
        } else {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchAktivitas.fulfilled, (state, action) => {
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
      .addCase(fetchAktivitas.rejected, (state, action) => {
        if (action.meta.arg.loadMore) {
          state.isLoadingMore = false;
        } else {
          state.isLoading = false;
        }
        state.error = action.payload;
      })
      
      // Fetch aktivitas detail
      .addCase(fetchAktivitasDetail.pending, (state) => {
        state.isLoadingDetail = true;
        state.error = null;
      })
      .addCase(fetchAktivitasDetail.fulfilled, (state, action) => {
        state.isLoadingDetail = false;
        state.detail = action.payload;
      })
      .addCase(fetchAktivitasDetail.rejected, (state, action) => {
        state.isLoadingDetail = false;
        state.error = action.payload;
      })
      
      // Create aktivitas
      .addCase(createAktivitas.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createAktivitas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createSuccess = true;
        state.list.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createAktivitas.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })
      
      // Update aktivitas
      .addCase(updateAktivitas.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateAktivitas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.updateSuccess = true;
        
        const index = state.list.findIndex(aktivitas => aktivitas.id_aktivitas === action.payload.id_aktivitas);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        
        if (state.detail && state.detail.id_aktivitas === action.payload.id_aktivitas) {
          state.detail = action.payload;
        }
      })
      .addCase(updateAktivitas.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      
      // Delete aktivitas
      .addCase(deleteAktivitas.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteAktivitas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deleteSuccess = true;
        state.list = state.list.filter(aktivitas => aktivitas.id_aktivitas !== action.payload);
        
        if (state.detail && state.detail.id_aktivitas === action.payload) {
          state.detail = null;
        }
        
        state.pagination.total -= 1;
      })
      .addCase(deleteAktivitas.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.deleteSuccess = false;
      })
      
      // Upload foto
      .addCase(uploadFotoAktivitas.pending, (state) => {
        state.isUploading = true;
        state.error = null;
        state.uploadSuccess = false;
      })
      .addCase(uploadFotoAktivitas.fulfilled, (state, action) => {
        state.isUploading = false;
        state.uploadSuccess = true;
        
        // Update the detail if it's the current aktivitas being viewed
        if (state.detail && state.detail.id_aktivitas === action.payload.id_aktivitas) {
          state.detail = action.payload;
        }
        
        // Update in the list if present
        const index = state.list.findIndex(aktivitas => aktivitas.id_aktivitas === action.payload.id_aktivitas);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(uploadFotoAktivitas.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload;
        state.uploadSuccess = false;
      });
  }
});

export const { resetAktivitasState, clearAktivitasDetail } = aktivitasSlice.actions;

export default aktivitasSlice.reducer;
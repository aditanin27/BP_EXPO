// src/redux/slices/aktivitasSlice.js
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
      return rejectWithValue(error.message || 'Failed to fetch aktivitas data');
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

export const fetchKelompokList = createAsyncThunk(
  'aktivitas/fetchKelompokList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await aktivitasApi.getKelompokList();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch kelompok list');
    }
  }
);

const aktivitasSlice = createSlice({
  name: 'aktivitas',
  initialState: {
    list: [],
    detail: null,
    kelompokList: [],
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
    isLoadingDetail: false,
    isLoadingKelompok: false,
    isSubmitting: false,
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
      // fetchAktivitas
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
      
      // fetchAktivitasDetail
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
      
      // createAktivitas
      .addCase(createAktivitas.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createAktivitas.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.createSuccess = true;
        state.list.unshift(action.payload);
      })
      .addCase(createAktivitas.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
        state.createSuccess = false;
      })
      
      // updateAktivitas
      .addCase(updateAktivitas.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateAktivitas.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.updateSuccess = true;
        
        // Update in list if present
        const updatedAktivitas = action.payload;
        const index = state.list.findIndex(item => item.id_aktivitas === updatedAktivitas.id_aktivitas);
        if (index !== -1) {
          state.list[index] = updatedAktivitas;
        }
        
        // Update detail if it's the one being viewed
        if (state.detail && state.detail.id_aktivitas === updatedAktivitas.id_aktivitas) {
          state.detail = updatedAktivitas;
        }
      })
      .addCase(updateAktivitas.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      
      // deleteAktivitas
      .addCase(deleteAktivitas.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteAktivitas.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.deleteSuccess = true;
        
        // Remove from list
        state.list = state.list.filter(item => item.id_aktivitas !== action.payload);
        
        // Clear detail if it's the one deleted
        if (state.detail && state.detail.id_aktivitas === action.payload) {
          state.detail = null;
        }
      })
      .addCase(deleteAktivitas.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
        state.deleteSuccess = false;
      })
      
      // uploadFotoAktivitas
      .addCase(uploadFotoAktivitas.pending, (state) => {
        state.isUploading = true;
        state.error = null;
        state.uploadSuccess = false;
      })
      .addCase(uploadFotoAktivitas.fulfilled, (state, action) => {
        state.isUploading = false;
        state.uploadSuccess = true;
        
        // Update detail if it's the one being viewed
        if (state.detail && state.detail.id_aktivitas === action.payload.id_aktivitas) {
          state.detail = action.payload;
        }
        
        // Update in list if present
        const updatedAktivitas = action.payload;
        const index = state.list.findIndex(item => item.id_aktivitas === updatedAktivitas.id_aktivitas);
        if (index !== -1) {
          state.list[index] = updatedAktivitas;
        }
      })
      .addCase(uploadFotoAktivitas.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload;
        state.uploadSuccess = false;
      })
      
      // fetchKelompokList
      .addCase(fetchKelompokList.pending, (state) => {
        state.isLoadingKelompok = true;
        state.error = null;
      })
      .addCase(fetchKelompokList.fulfilled, (state, action) => {
        state.isLoadingKelompok = false;
        state.kelompokList = action.payload;
      })
      .addCase(fetchKelompokList.rejected, (state, action) => {
        state.isLoadingKelompok = false;
        state.error = action.payload;
      });
  }
});

export const { resetAktivitasState, clearAktivitasDetail } = aktivitasSlice.actions;
export default aktivitasSlice.reducer;
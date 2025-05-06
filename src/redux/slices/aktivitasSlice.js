// src/redux/slices/aktivitasSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { aktivitasApi } from '../../api';

// Fetch list of aktivitas with optional filtering and pagination
export const fetchAktivitas = createAsyncThunk(
  'aktivitas/fetchAll',
  async ({ page = 1, search = '', jenis_kegiatan = '', id_shelter = '', loadMore = false }, { rejectWithValue }) => {
    try {
      const response = await aktivitasApi.getAll({ page, search, jenis_kegiatan, id_shelter });
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

// Fetch a single aktivitas by ID
export const fetchAktivitasById = createAsyncThunk(
  'aktivitas/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await aktivitasApi.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch aktivitas details');
    }
  }
);

// Create a new aktivitas
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

// Update an existing aktivitas
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

// Delete an aktivitas
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

// Upload foto for an aktivitas
export const uploadFotoAktivitas = createAsyncThunk(
  'aktivitas/uploadFoto',
  async ({ id, fotoNumber, fotoData }, { rejectWithValue }) => {
    try {
      const response = await aktivitasApi.uploadFoto(id, fotoNumber, fotoData);
      return {
        id_aktivitas: id,
        fotoNumber: fotoNumber,
        fotoUrl: response.data.foto_url
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upload foto');
    }
  }
);

// Get kelompok list for form selection
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
    selectedAktivitas: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 10,
      from: null,
      to: null
    },
    kelompokList: [],
    isLoading: false,
    isLoadingMore: false,
    isLoadingDetail: false,
    isUploadingPhoto: false,
    isLoadingKelompok: false,
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
    clearSelectedAktivitas: (state) => {
      state.selectedAktivitas = null;
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
      
      // fetchAktivitasById
      .addCase(fetchAktivitasById.pending, (state) => {
        state.isLoadingDetail = true;
        state.error = null;
      })
      .addCase(fetchAktivitasById.fulfilled, (state, action) => {
        state.isLoadingDetail = false;
        state.selectedAktivitas = action.payload;
      })
      .addCase(fetchAktivitasById.rejected, (state, action) => {
        state.isLoadingDetail = false;
        state.error = action.payload;
      })
      
      // createAktivitas
      .addCase(createAktivitas.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createAktivitas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list.unshift(action.payload);
        state.createSuccess = true;
        state.selectedAktivitas = action.payload;
      })
      .addCase(createAktivitas.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })
      
      // updateAktivitas
      .addCase(updateAktivitas.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateAktivitas.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Update in list if present
        const index = state.list.findIndex(
          item => item.id_aktivitas === action.payload.id_aktivitas
        );
        
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        
        // Update selected aktivitas if it's the same one
        if (state.selectedAktivitas && 
            state.selectedAktivitas.id_aktivitas === action.payload.id_aktivitas) {
          state.selectedAktivitas = action.payload;
        }
        
        state.updateSuccess = true;
      })
      .addCase(updateAktivitas.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      
      // deleteAktivitas
      .addCase(deleteAktivitas.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteAktivitas.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Remove from list
        state.list = state.list.filter(
          item => item.id_aktivitas !== action.payload
        );
        
        // Clear selected aktivitas if it's the one deleted
        if (state.selectedAktivitas && 
            state.selectedAktivitas.id_aktivitas === action.payload) {
          state.selectedAktivitas = null;
        }
        
        state.deleteSuccess = true;
      })
      .addCase(deleteAktivitas.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.deleteSuccess = false;
      })
      
      // uploadFotoAktivitas
      .addCase(uploadFotoAktivitas.pending, (state) => {
        state.isUploadingPhoto = true;
        state.error = null;
        state.uploadSuccess = false;
      })
      .addCase(uploadFotoAktivitas.fulfilled, (state, action) => {
        state.isUploadingPhoto = false;
        
        // Update the foto URL in selected aktivitas
        if (state.selectedAktivitas) {
          const fotoField = `foto_${action.payload.fotoNumber}`;
          const fotoUrlField = `foto_${action.payload.fotoNumber}_url`;
          
          state.selectedAktivitas = {
            ...state.selectedAktivitas,
            [fotoField]: action.payload.fotoUrl,
            [fotoUrlField]: action.payload.fotoUrl
          };
        }
        
        // Update in list if present
        const index = state.list.findIndex(
          item => item.id_aktivitas === action.payload.id_aktivitas
        );
        
        if (index !== -1) {
          const fotoField = `foto_${action.payload.fotoNumber}`;
          const fotoUrlField = `foto_${action.payload.fotoNumber}_url`;
          
          state.list[index] = {
            ...state.list[index],
            [fotoField]: action.payload.fotoUrl,
            [fotoUrlField]: action.payload.fotoUrl
          };
        }
        
        state.uploadSuccess = true;
      })
      .addCase(uploadFotoAktivitas.rejected, (state, action) => {
        state.isUploadingPhoto = false;
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

export const { resetAktivitasState, clearSelectedAktivitas } = aktivitasSlice.actions;
export default aktivitasSlice.reducer;
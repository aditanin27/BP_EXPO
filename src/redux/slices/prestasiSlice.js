import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { prestasiApi } from '../../api';

export const fetchPrestasi = createAsyncThunk(
  'prestasi/fetchAll',
  async ({ id_anak, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await prestasiApi.getAll({ id_anak, page });
      return {
        data: response.data,
        pagination: response.pagination,
        summary: response.summary
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch prestasi');
    }
  }
);

export const fetchPrestasiDetail = createAsyncThunk(
  'prestasi/fetchDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await prestasiApi.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch prestasi details');
    }
  }
);

export const createPrestasi = createAsyncThunk(
  'prestasi/create',
  async (prestasiData, { rejectWithValue }) => {
    try {
      const response = await prestasiApi.create(prestasiData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create prestasi');
    }
  }
);

export const updatePrestasi = createAsyncThunk(
  'prestasi/update',
  async ({ id, prestasiData }, { rejectWithValue }) => {
    try {
      const response = await prestasiApi.update(id, prestasiData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update prestasi');
    }
  }
);

export const deletePrestasi = createAsyncThunk(
  'prestasi/delete',
  async (id, { rejectWithValue }) => {
    try {
      await prestasiApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete prestasi');
    }
  }
);

const prestasiSlice = createSlice({
  name: 'prestasi',
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
    summary: {
      total_prestasi: 0
    },
    isLoading: false,
    error: null,
    createSuccess: false,
    updateSuccess: false,
    deleteSuccess: false
  },
  reducers: {
    resetPrestasiState: (state) => {
      state.error = null;
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },
    clearPrestasiDetail: (state) => {
      state.detail = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch prestasi
      .addCase(fetchPrestasi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPrestasi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
        state.summary = action.payload.summary;
      })
      .addCase(fetchPrestasi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch prestasi detail
      .addCase(fetchPrestasiDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPrestasiDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.detail = action.payload;
      })
      .addCase(fetchPrestasiDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create prestasi
      .addCase(createPrestasi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createPrestasi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createSuccess = true;
        state.list.unshift(action.payload);
        state.pagination.total += 1;
        state.summary.total_prestasi += 1;
      })
      .addCase(createPrestasi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })
      
      // Update prestasi
      .addCase(updatePrestasi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updatePrestasi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.updateSuccess = true;
        
        const index = state.list.findIndex(prestasi => prestasi.id_prestasi === action.payload.id_prestasi);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        
        if (state.detail && state.detail.id_prestasi === action.payload.id_prestasi) {
          state.detail = action.payload;
        }
      })
      .addCase(updatePrestasi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      
      // Delete prestasi
      .addCase(deletePrestasi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deletePrestasi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deleteSuccess = true;
        state.list = state.list.filter(prestasi => prestasi.id_prestasi !== action.payload);
        
        if (state.detail && state.detail.id_prestasi === action.payload) {
          state.detail = null;
        }
        
        state.pagination.total -= 1;
        state.summary.total_prestasi -= 1;
      })
      .addCase(deletePrestasi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.deleteSuccess = false;
      });
  }
});

export const { resetPrestasiState, clearPrestasiDetail } = prestasiSlice.actions;

export default prestasiSlice.reducer;
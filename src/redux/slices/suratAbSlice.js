import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { suratAbApi } from '../../api';

export const fetchSuratAb = createAsyncThunk(
  'suratAb/fetchAll',
  async ({ id_anak, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await suratAbApi.getAll({ id_anak, page });
      return {
        data: response.data,
        pagination: response.pagination,
        summary: response.summary
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch surat anak binaan');
    }
  }
);

export const fetchSuratAbDetail = createAsyncThunk(
  'suratAb/fetchDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await suratAbApi.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch surat anak binaan details');
    }
  }
);

export const createSuratAb = createAsyncThunk(
  'suratAb/create',
  async (suratData, { rejectWithValue }) => {
    try {
      const response = await suratAbApi.create(suratData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create surat anak binaan');
    }
  }
);

export const updateSuratAb = createAsyncThunk(
  'suratAb/update',
  async ({ id, suratData }, { rejectWithValue }) => {
    try {
      const response = await suratAbApi.update(id, suratData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update surat anak binaan');
    }
  }
);

export const deleteSuratAb = createAsyncThunk(
  'suratAb/delete',
  async (id, { rejectWithValue }) => {
    try {
      await suratAbApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete surat anak binaan');
    }
  }
);

const suratAbSlice = createSlice({
  name: 'suratAb',
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
      total_surat: 0
    },
    isLoading: false,
    error: null,
    createSuccess: false,
    updateSuccess: false,
    deleteSuccess: false
  },
  reducers: {
    resetSuratAbState: (state) => {
      state.error = null;
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },
    clearSuratAbDetail: (state) => {
      state.detail = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch surat Ab
      .addCase(fetchSuratAb.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSuratAb.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
        state.summary = action.payload.summary;
      })
      .addCase(fetchSuratAb.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch surat Ab detail
      .addCase(fetchSuratAbDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSuratAbDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.detail = action.payload;
      })
      .addCase(fetchSuratAbDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create surat Ab
      .addCase(createSuratAb.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createSuratAb.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createSuccess = true;
        state.list.unshift(action.payload);
        state.pagination.total += 1;
        state.summary.total_surat += 1;
      })
      .addCase(createSuratAb.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })
      
      // Update surat Ab
      .addCase(updateSuratAb.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateSuratAb.fulfilled, (state, action) => {
        state.isLoading = false;
        state.updateSuccess = true;
        
        const index = state.list.findIndex(surat => surat.id_surat === action.payload.id_surat);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        
        if (state.detail && state.detail.id_surat === action.payload.id_surat) {
          state.detail = action.payload;
        }
      })
      .addCase(updateSuratAb.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      
      // Delete surat Ab
      .addCase(deleteSuratAb.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteSuratAb.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deleteSuccess = true;
        state.list = state.list.filter(surat => surat.id_surat !== action.payload);
        
        if (state.detail && state.detail.id_surat === action.payload) {
          state.detail = null;
        }
        
        state.pagination.total -= 1;
        state.summary.total_surat -= 1;
      })
      .addCase(deleteSuratAb.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.deleteSuccess = false;
      });
  }
});

export const { resetSuratAbState, clearSuratAbDetail } = suratAbSlice.actions;

export default suratAbSlice.reducer;
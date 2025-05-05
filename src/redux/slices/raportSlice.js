import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { raportApi } from '../../api';

export const fetchRaports = createAsyncThunk(
  'raport/fetchAll',
  async ({ page = 1, id_anak = '' }, { rejectWithValue }) => {
    try {
      const response = await raportApi.getAll({ page, id_anak });
      return {
        data: response.data,
        pagination: response.pagination,
        summary: response.summary
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch raports');
    }
  }
);

export const fetchRaportDetail = createAsyncThunk(
  'raport/fetchDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await raportApi.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch raport details');
    }
  }
);

export const createRaport = createAsyncThunk(
  'raport/create',
  async (raportData, { rejectWithValue }) => {
    try {
      const response = await raportApi.create(raportData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create raport');
    }
  }
);

export const updateRaport = createAsyncThunk(
  'raport/update',
  async ({ id, raportData }, { rejectWithValue }) => {
    try {
      const response = await raportApi.update(id, raportData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update raport');
    }
  }
);

export const deleteRaport = createAsyncThunk(
  'raport/delete',
  async (id, { rejectWithValue }) => {
    try {
      await raportApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete raport');
    }
  }
);

const raportSlice = createSlice({
  name: 'raport',
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
      total_raport: 0
    },
    isLoading: false,
    error: null,
    createSuccess: false,
    updateSuccess: false,
    deleteSuccess: false
  },
  reducers: {
    resetRaportState: (state) => {
      state.error = null;
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },
    clearRaportDetail: (state) => {
      state.detail = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch raports
      .addCase(fetchRaports.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRaports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
        state.summary = action.payload.summary;
      })
      .addCase(fetchRaports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch raport detail
      .addCase(fetchRaportDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRaportDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.detail = action.payload;
      })
      .addCase(fetchRaportDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create raport
      .addCase(createRaport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createRaport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createSuccess = true;
        state.list.unshift(action.payload);
        state.pagination.total += 1;
        state.summary.total_raport += 1;
      })
      .addCase(createRaport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })
      
      // Update raport
      .addCase(updateRaport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateRaport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.updateSuccess = true;
        
        const index = state.list.findIndex(raport => raport.id_raport === action.payload.id_raport);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        
        if (state.detail && state.detail.id_raport === action.payload.id_raport) {
          state.detail = action.payload;
        }
      })
      .addCase(updateRaport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      
      // Delete raport
      .addCase(deleteRaport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteRaport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deleteSuccess = true;
        state.list = state.list.filter(raport => raport.id_raport !== action.payload);
        
        if (state.detail && state.detail.id_raport === action.payload) {
          state.detail = null;
        }
        
        state.pagination.total -= 1;
        state.summary.total_raport -= 1;
      })
      .addCase(deleteRaport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.deleteSuccess = false;
      });
  }
});

export const { resetRaportState, clearRaportDetail } = raportSlice.actions;
export default raportSlice.reducer;
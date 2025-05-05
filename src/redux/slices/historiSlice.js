import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { historiApi } from '../../api';

export const fetchHistori = createAsyncThunk(
  'histori/fetchAll',
  async ({ id_anak, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await historiApi.getAll({ id_anak, page });
      return {
        data: response.data,
        pagination: response.pagination,
        summary: response.summary
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch histori');
    }
  }
);

export const fetchHistoriDetail = createAsyncThunk(
  'histori/fetchDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await historiApi.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch histori details');
    }
  }
);

export const createHistori = createAsyncThunk(
  'histori/create',
  async (historiData, { rejectWithValue }) => {
    try {
      const response = await historiApi.create(historiData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create histori');
    }
  }
);

export const updateHistori = createAsyncThunk(
    'histori/update',
    async ({ id, historiData }, { rejectWithValue }) => {
      try {
        const isFileUpload = historiData.foto && typeof historiData.foto !== 'string';
        
        if (isFileUpload) {
          const formData = createFormData(historiData);
          return await historiApi.update(id, formData);
        } else {
          // If no new photo, pass existing photo URL or filename
          const updatePayload = { ...historiData };
          if (!historiData.foto) {
            delete updatePayload.foto;
          }
          return await historiApi.update(id, updatePayload);
        }
      } catch (error) {
        return rejectWithValue(error.message || 'Failed to update histori');
      }
    }
  );

export const deleteHistori = createAsyncThunk(
  'histori/delete',
  async (id, { rejectWithValue }) => {
    try {
      await historiApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete histori');
    }
  }
);

const historiSlice = createSlice({
  name: 'histori',
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
      total_histori: 0
    },
    isLoading: false,
    error: null,
    createSuccess: false,
    updateSuccess: false,
    deleteSuccess: false
  },
  reducers: {
    resetHistoriState: (state) => {
      state.error = null;
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },
    clearHistoriDetail: (state) => {
      state.detail = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch histori
      .addCase(fetchHistori.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHistori.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
        state.summary = action.payload.summary;
      })
      .addCase(fetchHistori.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch histori detail
      .addCase(fetchHistoriDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHistoriDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.detail = action.payload;
      })
      .addCase(fetchHistoriDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create histori
      .addCase(createHistori.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createHistori.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createSuccess = true;
        state.list.unshift(action.payload);
        state.pagination.total += 1;
        state.summary.total_histori += 1;
      })
      .addCase(createHistori.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })
      
      // Update histori
      .addCase(updateHistori.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateHistori.fulfilled, (state, action) => {
        state.isLoading = false;
        state.updateSuccess = true;
        
        const index = state.list.findIndex(histori => histori.id_histori === action.payload.id_histori);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        
        if (state.detail && state.detail.id_histori === action.payload.id_histori) {
          state.detail = action.payload;
        }
      })
      .addCase(updateHistori.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      
      // Delete histori
      .addCase(deleteHistori.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteHistori.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deleteSuccess = true;
        state.list = state.list.filter(histori => histori.id_histori !== action.payload);
        
        if (state.detail && state.detail.id_histori === action.payload) {
          state.detail = null;
        }
        
        state.pagination.total -= 1;
        state.summary.total_histori -= 1;
      })
      .addCase(deleteHistori.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.deleteSuccess = false;
      });
  }
});

export const { resetHistoriState, clearHistoriDetail } = historiSlice.actions;
export default historiSlice.reducer;
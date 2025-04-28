import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { anakApi } from '../../api';

export const fetchAnak = createAsyncThunk(
  'anak/fetchAll',
  async ({ page = 1, search = '', status = '', loadMore = false }, { rejectWithValue }) => {
    try {
      const response = await anakApi.getAll({ page, search, status });
      return {
        data: response.data,
        pagination: {
          ...response.pagination,
          total: response.pagination.total || 0,
          anak_aktif: response.summary?.anak_aktif || 0,
          anak_tidak_aktif: response.summary?.anak_tidak_aktif || 0
        },
        loadMore
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch anak');
    }
  }
);

export const fetchAnakById = createAsyncThunk(
  'anak/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await anakApi.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch anak');
    }
  }
);

export const createAnak = createAsyncThunk(
  'anak/create',
  async (dataAnak, { rejectWithValue }) => {
    try {
      const response = await anakApi.create(dataAnak);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create anak');
    }
  }
);

export const updateAnak = createAsyncThunk(
  'anak/update',
  async ({ id, dataAnak }, { rejectWithValue }) => {
    try {
      const response = await anakApi.update(id, dataAnak);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update anak');
    }
  }
);

export const deleteAnak = createAsyncThunk(
  'anak/delete',
  async (id, { rejectWithValue }) => {
    try {
      await anakApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete anak');
    }
  }
);

const anakSlice = createSlice({
  name: 'anak',
  initialState: {
    list: [],
    selectedAnak: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 10,
      from: null,
      to: null,
      anak_aktif: 0,
      anak_tidak_aktif: 0
    },
    isLoading: false,
    isLoadingMore: false,
    error: null,
    createSuccess: false,
    updateSuccess: false,
    deleteSuccess: false,
  },
  reducers: {
    resetAnakState: (state) => {
      state.error = null;
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },
    clearSlectedAnak: (state) => {
      state.selectedAnak = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnak.pending, (state, action) => {
        if (action.meta.arg.loadMore) {
          state.isLoadingMore = true;
        } else {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchAnak.fulfilled, (state, action) => {
        const { data, pagination, loadMore } = action.payload;
        
        if (loadMore) {
          state.list = [...state.list, ...data];
          state.isLoadingMore = false;
        } else {
          state.list = data;
          state.isLoading = false;
        }
        
        state.pagination = {
          ...pagination,
          total: pagination.total || 0,
          anak_aktif: pagination.anak_aktif || 0,
          anak_tidak_aktif: pagination.anak_tidak_aktif || 0
        };
      })
      .addCase(fetchAnak.rejected, (state, action) => {
        if (action.meta.arg.loadMore) {
          state.isLoadingMore = false;
        } else {
          state.isLoading = false;
        }
        state.error = action.payload;
      })
      
      .addCase(fetchAnakById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnakById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedAnak = action.payload;
      })
      .addCase(fetchAnakById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      .addCase(createAnak.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createAnak.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list.unshift(action.payload);
        state.createSuccess = true;
        
        state.pagination.total += 1;
        const statusValidasi = action.payload.status_validasi?.toLowerCase();
        if (statusValidasi === 'aktif') {
          state.pagination.anak_aktif += 1;
        } else {
          state.pagination.anak_tidak_aktif += 1;
        }
      })
      .addCase(createAnak.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })
      
      .addCase(updateAnak.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateAnak.fulfilled, (state, action) => {
        state.isLoading = false;
        state.updateSuccess = true;
        
        const index = state.list.findIndex(anak => anak.id_anak === action.payload.id_anak);
        if (index !== -1) {
          const oldAnak = state.list[index];
          const oldStatus = oldAnak.status_validasi?.toLowerCase();
          const newStatus = action.payload.status_validasi?.toLowerCase();
          
          if (oldStatus !== newStatus) {
            if (oldStatus === 'aktif') {
              state.pagination.anak_aktif -= 1;
              state.pagination.anak_tidak_aktif += 1;
            } else {
              state.pagination.anak_aktif += 1;
              state.pagination.anak_tidak_aktif -= 1;
            }
          }
          
          state.list[index] = action.payload;
        }
        
        if (state.selectedAnak && state.selectedAnak.id_anak === action.payload.id_anak) {
          state.selectedAnak = action.payload;
        }
      })
      .addCase(updateAnak.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      
      .addCase(deleteAnak.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteAnak.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deleteSuccess = true;
        
        const deletedAnak = state.list.find(anak => anak.id_anak === action.payload);
        
        state.list = state.list.filter(anak => anak.id_anak !== action.payload);
        
        if (deletedAnak) {
          state.pagination.total -= 1;
          const statusValidasi = deletedAnak.status_validasi?.toLowerCase();
          if (statusValidasi === 'aktif') {
            state.pagination.anak_aktif -= 1;
          } else {
            state.pagination.anak_tidak_aktif -= 1;
          }
        }
        
        if (state.selectedAnak && state.selectedAnak.id_anak === action.payload) {
          state.selectedAnak = null;
        }
      })
      .addCase(deleteAnak.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.deleteSuccess = false;
      });
  },
});

export const { resetAnakState, clearSlectedAnak } = anakSlice.actions;
export default anakSlice.reducer;
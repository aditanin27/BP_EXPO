import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';


export const fetchAnak = createAsyncThunk(
  'anak/fetchAll',
  async ({ page = 1, search = '', status = '', loadMore = false }, { rejectWithValue }) => {
    try {
      const response = await api.getAnak({ page, search, status });
      if (response.success) {
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
      }
      return rejectWithValue(response.message || 'Failed to fetch anak');
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch anak');
    }
  }
);

// Thunk for fetching a single anak by ID
export const fetchAnakById = createAsyncThunk(
  'anak/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.getAnakById(id);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch anak');
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch anak');
    }
  }
);

// Thunk for creating a new anak
export const createAnak = createAsyncThunk(
  'anak/create',
  async (dataAnak, { rejectWithValue }) => {
    try {
      const response = await api.createAnak(dataAnak);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to create anak');
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create anak');
    }
  }
);

// Thunk for updating a anak
export const updateAnak = createAsyncThunk(
  'anak/update',
  async ({ id, dataAnak }, { rejectWithValue }) => {
    try {
      const response = await api.updateAnak(id, dataAnak);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to update anak');
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update anak');
    }
  }
);

// Thunk for deleting a anak
export const deleteAnak = createAsyncThunk(
  'anak/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.deleteAnak(id);
      if (response.success) {
        return id; // Return the ID of the deleted anak
      }
      return rejectWithValue(response.message || 'Failed to delete anak');
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
      // Status count fields
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
          // Append new data when loading more
          state.list = [...state.list, ...data];
          state.isLoadingMore = false;
        } else {
          // Replace data when fetching initial or fresh data
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
      
      // Handle fetchAnakById
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
      
      // Handle createAnak
      .addCase(createAnak.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createAnak.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list.unshift(action.payload); // Add to the beginning of the list
        state.createSuccess = true;
        
        // Update pagination counts
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
      
      // Handle updateAnak
      .addCase(updateAnak.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateAnak.fulfilled, (state, action) => {
        state.isLoading = false;
        state.updateSuccess = true;
        
        // Update the anak in the list
        const index = state.list.findIndex(anak => anak.id_anak === action.payload.id_anak);
        if (index !== -1) {
          const oldAnak = state.list[index];
          const oldStatus = oldAnak.status_validasi?.toLowerCase();
          const newStatus = action.payload.status_validasi?.toLowerCase();
          
          // Update status counts if validation status changed
          if (oldStatus !== newStatus) {
            if (oldStatus === 'aktif') {
              state.pagination.anak_aktif -= 1;
              state.pagination.anak_tidak_aktif += 1;
            } else {
              state.pagination.anak_aktif += 1;
              state.pagination.anak_tidak_aktif -= 1;
            }
          }
          
          // Replace the old anak with the updated anak
          state.list[index] = action.payload;
        }
        
        // Also update selectedanak if currently viewing this anak
        if (state.selectedAnak && state.selectedAnak.id_anak === action.payload.id_anak) {
          state.selectedAnak = action.payload;
        }
      })
      .addCase(updateAnak.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      
      // Handle deleteAnak
      .addCase(deleteAnak.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteAnak.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deleteSuccess = true;
        
        // Find the anak being deleted
        const deletedAnak = state.list.find(anak => anak.id_anak === action.payload);
        
        // Remove the anak from the list
        state.list = state.list.filter(anak => anak.id_anak !== action.payload);
        
        // Update pagination counts
        if (deletedAnak) {
          state.pagination.total -= 1;
          const statusValidasi = deletedAnak.status_validasi?.toLowerCase();
          if (statusValidasi === 'aktif') {
            state.pagination.anak_aktif -= 1;
          } else {
            state.pagination.anak_tidak_aktif -= 1;
          }
        }
        
        // Clear selectedAnak if it was the deleted anak
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
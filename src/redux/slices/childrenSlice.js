import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';

// Thunk for fetching children with pagination
export const fetchChildren = createAsyncThunk(
  'children/fetchAll',
  async ({ page = 1, search = '', status = '', loadMore = false }, { rejectWithValue }) => {
    try {
      const response = await api.getChildren({ page, search, status });
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
      return rejectWithValue(response.message || 'Failed to fetch children');
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch children');
    }
  }
);

// Thunk for fetching a single child by ID
export const fetchChildById = createAsyncThunk(
  'children/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.getChildById(id);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch child');
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch child');
    }
  }
);

// Thunk for creating a new child
export const createChild = createAsyncThunk(
  'children/create',
  async (childData, { rejectWithValue }) => {
    try {
      const response = await api.createChild(childData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to create child');
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create child');
    }
  }
);

// Thunk for updating a child
export const updateChild = createAsyncThunk(
  'children/update',
  async ({ id, childData }, { rejectWithValue }) => {
    try {
      const response = await api.updateChild(id, childData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to update child');
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update child');
    }
  }
);

// Thunk for deleting a child
export const deleteChild = createAsyncThunk(
  'children/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.deleteChild(id);
      if (response.success) {
        return id; // Return the ID of the deleted child
      }
      return rejectWithValue(response.message || 'Failed to delete child');
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete child');
    }
  }
);

const childrenSlice = createSlice({
  name: 'children',
  initialState: {
    list: [],
    selectedChild: null,
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
    resetChildrenState: (state) => {
      state.error = null;
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },
    clearSelectedChild: (state) => {
      state.selectedChild = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchChildren
      .addCase(fetchChildren.pending, (state, action) => {
        if (action.meta.arg.loadMore) {
          state.isLoadingMore = true;
        } else {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchChildren.fulfilled, (state, action) => {
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
        
        // Update pagination dengan memastikan status count tersedia
        state.pagination = {
          ...pagination,
          total: pagination.total || 0,
          anak_aktif: pagination.anak_aktif || 0,
          anak_tidak_aktif: pagination.anak_tidak_aktif || 0
        };
      })
      .addCase(fetchChildren.rejected, (state, action) => {
        if (action.meta.arg.loadMore) {
          state.isLoadingMore = false;
        } else {
          state.isLoading = false;
        }
        state.error = action.payload;
      })
      
      // Handle fetchChildById
      .addCase(fetchChildById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChildById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedChild = action.payload;
      })
      .addCase(fetchChildById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Handle createChild
      .addCase(createChild.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createChild.fulfilled, (state, action) => {
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
      .addCase(createChild.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })
      
      // Handle updateChild
      .addCase(updateChild.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateChild.fulfilled, (state, action) => {
        state.isLoading = false;
        state.updateSuccess = true;
        
        // Update the child in the list
        const index = state.list.findIndex(child => child.id_anak === action.payload.id_anak);
        if (index !== -1) {
          const oldChild = state.list[index];
          const oldStatus = oldChild.status_validasi?.toLowerCase();
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
          
          // Replace the old child with the updated child
          state.list[index] = action.payload;
        }
        
        // Also update selectedChild if currently viewing this child
        if (state.selectedChild && state.selectedChild.id_anak === action.payload.id_anak) {
          state.selectedChild = action.payload;
        }
      })
      .addCase(updateChild.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      
      // Handle deleteChild
      .addCase(deleteChild.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteChild.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deleteSuccess = true;
        
        // Find the child being deleted
        const deletedChild = state.list.find(child => child.id_anak === action.payload);
        
        // Remove the child from the list
        state.list = state.list.filter(child => child.id_anak !== action.payload);
        
        // Update pagination counts
        if (deletedChild) {
          state.pagination.total -= 1;
          const statusValidasi = deletedChild.status_validasi?.toLowerCase();
          if (statusValidasi === 'aktif') {
            state.pagination.anak_aktif -= 1;
          } else {
            state.pagination.anak_tidak_aktif -= 1;
          }
        }
        
        // Clear selectedChild if it was the deleted child
        if (state.selectedChild && state.selectedChild.id_anak === action.payload) {
          state.selectedChild = null;
        }
      })
      .addCase(deleteChild.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.deleteSuccess = false;
      });
  },
});

export const { resetChildrenState, clearSelectedChild } = childrenSlice.actions;
export default childrenSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';

// Thunk for fetching all children
export const fetchChildren = createAsyncThunk(
  'children/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getChildren();
      if (response.success) {
        return response.data;
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
    isLoading: false,
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
      .addCase(fetchChildren.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChildren.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchChildren.rejected, (state, action) => {
        state.isLoading = false;
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
        state.list.push(action.payload);
        state.createSuccess = true;
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
        
        // Remove the child from the list
        state.list = state.list.filter(child => child.id_anak !== action.payload);
        
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
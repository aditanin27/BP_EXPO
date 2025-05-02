import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { kelompokApi } from '../../api';

export const fetchKelompok = createAsyncThunk(
  'kelompok/fetch',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await kelompokApi.getAll(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch kelompok');
    }
  }
);

export const fetchKelompokDetail = createAsyncThunk(
  'kelompok/fetchDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await kelompokApi.getById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch kelompok detail');
    }
  }
);

export const createKelompok = createAsyncThunk(
  'kelompok/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await kelompokApi.create(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create kelompok');
    }
  }
);

export const updateKelompok = createAsyncThunk(
  'kelompok/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await kelompokApi.update(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update kelompok');
    }
  }
);

export const deleteKelompok = createAsyncThunk(
  'kelompok/delete',
  async (id, { rejectWithValue }) => {
    try {
      await kelompokApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete kelompok');
    }
  }
);

export const fetchLevelAnakBinaan = createAsyncThunk(
  'kelompok/fetchLevels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await kelompokApi.getLevels();
      console.log('Level Response:', response);
      return response.data || [];
    } catch (error) {
      console.error('Level Fetch Error:', error);
      return rejectWithValue(error.message || 'Failed to fetch levels');
    }
  }
 );

export const fetchAvailableChildren = createAsyncThunk(
  'kelompok/fetchAvailableChildren',
  async (id_shelter, { rejectWithValue }) => {
    try {
      const response = await kelompokApi.getAvailableChildren(id_shelter);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch available children');
    }
  }
);

export const fetchGroupChildren = createAsyncThunk(
  'kelompok/fetchGroupChildren',
  async (id_kelompok, { rejectWithValue }) => {
    try {
      const response = await kelompokApi.getGroupChildren(id_kelompok);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch group children');
    }
  }
);

export const addChildToGroup = createAsyncThunk(
  'kelompok/addChild',
  async ({ id_kelompok, id_anak }, { rejectWithValue }) => {
    try {
      const response = await kelompokApi.addChildToGroup(id_kelompok, id_anak);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add child to group');
    }
  }
);

export const removeChildFromGroup = createAsyncThunk(
  'kelompok/removeChild',
  async ({ id_kelompok, id_anak }, { rejectWithValue }) => {
    try {
      const response = await kelompokApi.removeChildFromGroup(id_kelompok, id_anak);
      return { id_kelompok, id_anak };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to remove child from group');
    }
  }
);

export const moveChildToShelter = createAsyncThunk(
  'kelompok/moveChild',
  async ({ id_anak, id_shelter_baru }, { rejectWithValue }) => {
    try {
      const response = await kelompokApi.moveChildToShelter(id_anak, id_shelter_baru);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to move child to shelter');
    }
  }
);

const kelompokSlice = createSlice({
  name: 'kelompok',
  initialState: {
    data: [],
    detail: null,
    pagination: null,
    summary: null,
    levels: [],
    availableChildren: [],
    groupChildren: [],
    isLoading: false,
    isLoadingDetail: false,
    isLoadingLevels: false,
    isLoadingChildren: false,
    isAddingChild: false,
    isRemovingChild: false,
    isMovingChild: false,
    error: null,
    createSuccess: false,
    updateSuccess: false,
    deleteSuccess: false,
    addChildSuccess: false,
    removeChildSuccess: false,
    moveChildSuccess: false
  },
  reducers: {
    resetKelompokError: (state) => {
      state.error = null;
    },
    resetKelompokSuccess: (state) => {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
      state.addChildSuccess = false;
      state.removeChildSuccess = false;
      state.moveChildSuccess = false;
    },
    clearKelompokDetail: (state) => {
      state.detail = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch kelompok
      .addCase(fetchKelompok.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchKelompok.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
        state.pagination = action.payload.pagination;
        state.summary = action.payload.summary;
      })
      .addCase(fetchKelompok.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch kelompok detail
      .addCase(fetchKelompokDetail.pending, (state) => {
        state.isLoadingDetail = true;
        state.error = null;
      })
      .addCase(fetchKelompokDetail.fulfilled, (state, action) => {
        state.isLoadingDetail = false;
        state.detail = action.payload.data;
      })
      .addCase(fetchKelompokDetail.rejected, (state, action) => {
        state.isLoadingDetail = false;
        state.error = action.payload;
      })
      
      // Create kelompok
      .addCase(createKelompok.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createKelompok.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data.unshift(action.payload.data);
        state.createSuccess = true;
      })
      .addCase(createKelompok.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })
      
      // Update kelompok
      .addCase(updateKelompok.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateKelompok.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.data.findIndex(
          (item) => item.id_kelompok === action.payload.data.id_kelompok
        );
        if (index !== -1) {
          state.data[index] = action.payload.data;
        }
        state.detail = action.payload.data;
        state.updateSuccess = true;
      })
      .addCase(updateKelompok.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      
      // Delete kelompok
      .addCase(deleteKelompok.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteKelompok.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = state.data.filter((item) => item.id_kelompok !== action.payload);
        state.deleteSuccess = true;
      })
      .addCase(deleteKelompok.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.deleteSuccess = false;
      })
      
      // Fetch level anak binaan
      .addCase(fetchLevelAnakBinaan.pending, (state) => {
        state.isLoadingLevels = true;
        state.error = null;
      })
      .addCase(fetchLevelAnakBinaan.fulfilled, (state, action) => {
        state.isLoadingLevels = false;
        state.levels = action.payload;
      })
      .addCase(fetchLevelAnakBinaan.rejected, (state, action) => {
        state.isLoadingLevels = false;
        state.error = action.payload;
      })
      
      // Fetch available children
      .addCase(fetchAvailableChildren.pending, (state) => {
        state.isLoadingChildren = true;
        state.error = null;
      })
      .addCase(fetchAvailableChildren.fulfilled, (state, action) => {
        state.isLoadingChildren = false;
        state.availableChildren = action.payload;
      })
      .addCase(fetchAvailableChildren.rejected, (state, action) => {
        state.isLoadingChildren = false;
        state.error = action.payload;
      })
      
      // Fetch group children
      .addCase(fetchGroupChildren.pending, (state) => {
        state.isLoadingChildren = true;
        state.error = null;
      })
      .addCase(fetchGroupChildren.fulfilled, (state, action) => {
        state.isLoadingChildren = false;
        state.groupChildren = action.payload;
      })
      .addCase(fetchGroupChildren.rejected, (state, action) => {
        state.isLoadingChildren = false;
        state.error = action.payload;
      })
      
      // Add child to group
      .addCase(addChildToGroup.pending, (state) => {
        state.isAddingChild = true;
        state.error = null;
        state.addChildSuccess = false;
      })
      .addCase(addChildToGroup.fulfilled, (state, action) => {
        state.isAddingChild = false;
        state.availableChildren = state.availableChildren.filter(
          (child) => child.id_anak !== action.payload.id_anak
        );
        state.groupChildren.push(action.payload);
        
        // Update jumlah_anggota in detail if available
        if (state.detail) {
          state.detail.jumlah_anggota = state.groupChildren.length;
        }
        
        state.addChildSuccess = true;
      })
      .addCase(addChildToGroup.rejected, (state, action) => {
        state.isAddingChild = false;
        state.error = action.payload;
        state.addChildSuccess = false;
      })
      
      // Remove child from group
      .addCase(removeChildFromGroup.pending, (state) => {
        state.isRemovingChild = true;
        state.error = null;
        state.removeChildSuccess = false;
      })
      .addCase(removeChildFromGroup.fulfilled, (state, action) => {
        state.isRemovingChild = false;
        const { id_anak } = action.payload;
        
        // Find the child that was removed and add it to available children
        const removedChild = state.groupChildren.find(
          (child) => child.id_anak === id_anak
        );
        
        if (removedChild) {
          state.availableChildren.push({
            ...removedChild,
            id_kelompok: null
          });
        }
        
        // Remove from group children
        state.groupChildren = state.groupChildren.filter(
          (child) => child.id_anak !== id_anak
        );
        
        // Update jumlah_anggota in detail if available
        if (state.detail) {
          state.detail.jumlah_anggota = state.groupChildren.length;
        }
        
        state.removeChildSuccess = true;
      })
      .addCase(removeChildFromGroup.rejected, (state, action) => {
        state.isRemovingChild = false;
        state.error = action.payload;
        state.removeChildSuccess = false;
      })
      
      // Move child to shelter
      .addCase(moveChildToShelter.pending, (state) => {
        state.isMovingChild = true;
        state.error = null;
        state.moveChildSuccess = false;
      })
      .addCase(moveChildToShelter.fulfilled, (state, action) => {
        state.isMovingChild = false;
        
        // Remove child from available children
        state.availableChildren = state.availableChildren.filter(
          (child) => child.id_anak !== action.payload.id_anak
        );
        
        state.moveChildSuccess = true;
      })
      .addCase(moveChildToShelter.rejected, (state, action) => {
        state.isMovingChild = false;
        state.error = action.payload;
        state.moveChildSuccess = false;
      });
  },
});

export const { resetKelompokError, resetKelompokSuccess, clearKelompokDetail } = kelompokSlice.actions;
export default kelompokSlice.reducer;
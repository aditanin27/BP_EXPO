import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { surveyApi } from '../../api';

export const fetchSurveys = createAsyncThunk(
  'survey/fetchAll',
  async ({ page = 1, search = '', show_all = false, loadMore = false }, { rejectWithValue }) => {
    try {
      const response = await surveyApi.getAll({ page, search, show_all });
      return {
        data: response.data,
        pagination: response.pagination,
        loadMore
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch surveys');
    }
  }
);

export const fetchSurveyDetail = createAsyncThunk(
  'survey/fetchDetail',
  async (id_keluarga, { rejectWithValue }) => {
    try {
      const response = await surveyApi.getById(id_keluarga);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch survey details');
    }
  }
);

export const createSurvey = createAsyncThunk(
  'survey/create',
  async ({ id_keluarga, surveyData }, { rejectWithValue }) => {
    try {
      const response = await surveyApi.create(id_keluarga, surveyData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create survey');
    }
  }
);

export const deleteSurvey = createAsyncThunk(
  'survey/delete',
  async (id_keluarga, { rejectWithValue }) => {
    try {
      await surveyApi.delete(id_keluarga);
      return id_keluarga;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete survey');
    }
  }
);

const surveySlice = createSlice({
  name: 'survey',
  initialState: {
    list: [],
    availableFamilies: [],
    detail: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 10,
      from: null,
      to: null
    },
    isLoading: false,
    isLoadingMore: false,
    isLoadingDetail: false,
    error: null,
    createSuccess: false,
    updateSuccess: false,
    deleteSuccess: false
  },
  reducers: {
    resetSurveyState: (state) => {
      state.error = null;
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },
    clearSurveyDetail: (state) => {
      state.detail = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch surveys
      .addCase(fetchSurveys.pending, (state, action) => {
        if (action.meta.arg.loadMore) {
          state.isLoadingMore = true;
        } else {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchSurveys.fulfilled, (state, action) => {
        const { data, pagination, loadMore } = action.payload;
        
        if (loadMore) {
          state.list = [...state.list, ...data];
          state.isLoadingMore = false;
        } else {
          // If showing all surveys (not just available families)
          if (action.meta.arg.show_all) {
            state.list = data;
          } else {
            // If showing available families without surveys
            state.availableFamilies = data;
          }
          state.isLoading = false;
        }
        
        state.pagination = pagination;
      })
      .addCase(fetchSurveys.rejected, (state, action) => {
        if (action.meta.arg.loadMore) {
          state.isLoadingMore = false;
        } else {
          state.isLoading = false;
        }
        state.error = action.payload;
      })
      
      // Fetch survey detail
      .addCase(fetchSurveyDetail.pending, (state) => {
        state.isLoadingDetail = true;
        state.error = null;
      })
      .addCase(fetchSurveyDetail.fulfilled, (state, action) => {
        state.isLoadingDetail = false;
        state.detail = action.payload;
      })
      .addCase(fetchSurveyDetail.rejected, (state, action) => {
        state.isLoadingDetail = false;
        state.error = action.payload;
      })
      
      // Create survey
      .addCase(createSurvey.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createSurvey.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createSuccess = true;
        
        // If we have a list of surveys, add the new one
        if (state.list.length > 0) {
          state.list.unshift(action.payload);
        }
        
        // Remove the family from available families list
        if (state.availableFamilies.length > 0) {
          const id_keluarga = action.meta.arg.id_keluarga;
          state.availableFamilies = state.availableFamilies.filter(
            family => family.id_keluarga !== id_keluarga
          );
        }
      })
      .addCase(createSurvey.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })
      
      // Delete survey
      .addCase(deleteSurvey.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteSurvey.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deleteSuccess = true;
        
        // Remove from list
        const id_keluarga = action.payload;
        state.list = state.list.filter(item => {
          if (item.id_keluarga) {
            return item.id_keluarga !== id_keluarga;
          }
          if (item.keluarga && item.keluarga.id_keluarga) {
            return item.keluarga.id_keluarga !== id_keluarga;
          }
          return true;
        });
        
        // Clear detail if it's the same survey
        if (state.detail && 
            ((state.detail.id_keluarga === id_keluarga) || 
             (state.detail.keluarga && state.detail.keluarga.id_keluarga === id_keluarga))) {
          state.detail = null;
        }
      })
      .addCase(deleteSurvey.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.deleteSuccess = false;
      });
  }
});

export const { resetSurveyState, clearSurveyDetail } = surveySlice.actions;
export default surveySlice.reducer;
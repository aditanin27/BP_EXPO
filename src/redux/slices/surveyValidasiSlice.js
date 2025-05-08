import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { surveyValidasiApi } from '../../api';

export const fetchSurveysForValidation = createAsyncThunk(
  'surveyValidasi/fetchAll',
  async ({ page = 1, search = '', status = '', loadMore = false }, { rejectWithValue }) => {
    try {
      const response = await surveyValidasiApi.getAll({ page, search, status });
      return {
        data: response.data,
        pagination: response.pagination,
        loadMore
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch surveys for validation');
    }
  }
);

export const validateSurvey = createAsyncThunk(
  'surveyValidasi/validate',
  async ({ id_survey, validationData }, { rejectWithValue }) => {
    try {
      const response = await surveyValidasiApi.validateSurvey(id_survey, validationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to validate survey');
    }
  }
);

export const fetchValidationSummary = createAsyncThunk(
  'surveyValidasi/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await surveyValidasiApi.getValidationSummary();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch validation summary');
    }
  }
);

const surveyValidasiSlice = createSlice({
  name: 'surveyValidasi',
  initialState: {
    list: [],
    pagination: {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 10,
      from: null,
      to: null
    },
    summary: {
      total: 0,
      pending: 0,
      layak: 0,
      tidak_layak: 0,
      tambah_kelayakan: 0
    },
    isLoading: false,
    isLoadingMore: false,
    isLoadingSummary: false,
    isValidating: false,
    error: null,
    validateSuccess: false
  },
  reducers: {
    resetSurveyValidasiState: (state) => {
      state.error = null;
      state.validateSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch surveys for validation
      .addCase(fetchSurveysForValidation.pending, (state, action) => {
        if (action.meta.arg.loadMore) {
          state.isLoadingMore = true;
        } else {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchSurveysForValidation.fulfilled, (state, action) => {
        const { data, pagination, loadMore } = action.payload;
        
        if (loadMore) {
          state.list = [...state.list, ...data];
          state.isLoadingMore = false;
        } else {
          state.list = data;
          state.isLoading = false;
        }
        
        state.pagination = pagination;
      })
      .addCase(fetchSurveysForValidation.rejected, (state, action) => {
        if (action.meta.arg.loadMore) {
          state.isLoadingMore = false;
        } else {
          state.isLoading = false;
        }
        state.error = action.payload;
      })
      
      // Validate survey
      .addCase(validateSurvey.pending, (state) => {
        state.isValidating = true;
        state.error = null;
        state.validateSuccess = false;
      })
      .addCase(validateSurvey.fulfilled, (state, action) => {
        state.isValidating = false;
        state.validateSuccess = true;
        
        // Update the survey in the list
        const updatedSurvey = action.payload;
        const index = state.list.findIndex(
          survey => survey.id_survey === updatedSurvey.id_survey
        );
        
        if (index !== -1) {
          state.list[index] = updatedSurvey;
        }
        
        // Update summary counts, adding to validated count
        if (updatedSurvey.hasil_survey === 'Layak') {
          state.summary.layak += 1;
          state.summary.pending -= 1;
        } else if (updatedSurvey.hasil_survey === 'Tidak Layak') {
          state.summary.tidak_layak += 1;
          state.summary.pending -= 1;
        } else if (updatedSurvey.hasil_survey === 'Tambah Kelayakan') {
          state.summary.tambah_kelayakan += 1;
          state.summary.pending -= 1;
        }
      })
      .addCase(validateSurvey.rejected, (state, action) => {
        state.isValidating = false;
        state.error = action.payload;
        state.validateSuccess = false;
      })
      
      // Fetch validation summary
      .addCase(fetchValidationSummary.pending, (state) => {
        state.isLoadingSummary = true;
        state.error = null;
      })
      .addCase(fetchValidationSummary.fulfilled, (state, action) => {
        state.isLoadingSummary = false;
        state.summary = action.payload;
      })
      .addCase(fetchValidationSummary.rejected, (state, action) => {
        state.isLoadingSummary = false;
        state.error = action.payload;
      });
  }
});

export const { resetSurveyValidasiState } = surveyValidasiSlice.actions;
export default surveyValidasiSlice.reducer;
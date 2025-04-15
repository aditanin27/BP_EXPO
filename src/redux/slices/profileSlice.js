import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';

export const fetchProfile = createAsyncThunk(
  'profile/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getProfile();
      if (response.success) {
        return response;
      }
      return rejectWithValue(response.message || 'Failed to fetch profile');
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    resetProfileError: (state) => {
      state.error = null;
    },
    clearProfile: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProfileError, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
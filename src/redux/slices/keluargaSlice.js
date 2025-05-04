import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { keluargaApi } from '../../api';

// Async thunk for fetching keluarga list
export const fetchKeluarga = createAsyncThunk(
  'keluarga/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await keluargaApi.getAll(params);
      return {
        data: response.data,
        pagination: response.pagination
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch keluarga data');
    }
  }
);

// Async thunk for fetching a single keluarga detail
export const fetchKeluargaDetail = createAsyncThunk(
  'keluarga/fetchDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await keluargaApi.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch keluarga details');
    }
  }
);

// Async thunk for creating a new keluarga
export const createKeluarga = createAsyncThunk(
  'keluarga/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await keluargaApi.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create keluarga');
    }
  }
);

// Async thunk for updating a keluarga
export const updateKeluarga = createAsyncThunk(
  'keluarga/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await keluargaApi.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update keluarga');
    }
  }
);

// Async thunk for deleting a keluarga
export const deleteKeluarga = createAsyncThunk(
  'keluarga/delete',
  async (id, { rejectWithValue }) => {
    try {
      await keluargaApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete keluarga');
    }
  }
);

// Async thunk for fetching dropdown data
export const fetchDropdownData = createAsyncThunk(
  'keluarga/fetchDropdowns',
  async (_, { rejectWithValue }) => {
    try {
      const response = await keluargaApi.getDropdownData();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch dropdown data');
    }
  }
);

// Async thunk for fetching wilbin options by kacab
export const fetchWilbinByKacab = createAsyncThunk(
  'keluarga/fetchWilbin',
  async (idKacab, { rejectWithValue }) => {
    try {
      const response = await keluargaApi.getWilbinByKacab(idKacab);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch wilbin data');
    }
  }
);

// Async thunk for fetching shelter options by wilbin
export const fetchShelterByWilbin = createAsyncThunk(
  'keluarga/fetchShelter',
  async (idWilbin, { rejectWithValue }) => {
    try {
      const response = await keluargaApi.getShelterByWilbin(idWilbin);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch shelter data');
    }
  }
);

// Initial state
const initialState = {
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
  dropdowns: {
    kacab: [],
    bank: [],
  },
  wilbinOptions: [],
  shelterOptions: [],
  isLoading: false,
  isLoadingDropdowns: false,
  error: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
  
  // Form data for multi-step form
  formData: {
    // Keluarga data
    keluarga: {
      no_kk: '',
      kepala_keluarga: '',
      status_ortu: '',
      id_kacab: '',
      id_wilbin: '',
      id_shelter: '',
      bank_choice: 'no',
      id_bank: '',
      no_rek: '',
      an_rek: '',
      telp_choice: 'no',
      no_tlp: '',
      an_tlp: '',
    },
    
    // Anak Pendidikan data
    anakPendidikan: {
      jenjang: '',
      kelas: '',
      nama_sekolah: '',
      alamat_sekolah: '',
      jurusan: '',
      semester: '',
      nama_pt: '',
      alamat_pt: '',
    },
    
    // Anak data
    anak: {
      nik_anak: '',
      anak_ke: '',
      dari_bersaudara: '',
      nick_name: '',
      full_name: '',
      agama: 'Islam',
      tempat_lahir: '',
      tanggal_lahir: '',
      jenis_kelamin: 'L',
      tinggal_bersama: '',
      jenis_anak_binaan: 'BPCB',
      hafalan: 'Non-Tahfidz',
      pelajaran_favorit: '',
      hobi: '',
      prestasi: '',
      jarak_rumah: '',
      transportasi: '',
      foto: null,
    },
    
    // Ayah data
    ayah: {
      nik_ayah: '',
      nama_ayah: '',
      agama_ayah: 'Islam',
      tempat_lahir_ayah: '',
      tanggal_lahir_ayah: '',
      alamat_ayah: '',
      id_prov_ayah: '',
      id_kab_ayah: '',
      id_kec_ayah: '',
      id_kel_ayah: '',
      penghasilan_ayah: '',
      tanggal_kematian_ayah: '',
      penyebab_kematian_ayah: '',
    },
    
    // Ibu data
    ibu: {
      nik_ibu: '',
      nama_ibu: '',
      agama_ibu: 'Islam',
      tempat_lahir_ibu: '',
      tanggal_lahir_ibu: '',
      alamat_ibu: '',
      id_prov_ibu: '',
      id_kab_ibu: '',
      id_kec_ibu: '',
      id_kel_ibu: '',
      penghasilan_ibu: '',
      tanggal_kematian_ibu: '',
      penyebab_kematian_ibu: '',
    },
    
    // Wali data
    wali: {
      nik_wali: '',
      nama_wali: '',
      agama_wali: 'Islam',
      tempat_lahir_wali: '',
      tanggal_lahir_wali: '',
      alamat_wali: '',
      id_prov_wali: '',
      id_kab_wali: '',
      id_kec_wali: '',
      id_kel_wali: '',
      penghasilan_wali: '',
      hub_kerabat_wali: '',
    },
  },
  currentStep: 1,
  totalSteps: 6,
};

// Create slice
const keluargaSlice = createSlice({
  name: 'keluarga',
  initialState,
  reducers: {
    resetKeluargaState: (state) => {
      state.error = null;
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },
    clearKeluargaDetail: (state) => {
      state.detail = null;
    },
    // Update form data by section
    updateFormData: (state, action) => {
      const { section, data } = action.payload;
      state.formData[section] = {
        ...state.formData[section],
        ...data
      };
    },
    // Reset form data
    resetFormData: (state) => {
      state.formData = initialState.formData;
      state.currentStep = 1;
    },
    // Navigation between steps
    nextStep: (state) => {
      if (state.currentStep < state.totalSteps) {
        state.currentStep += 1;
      }
    },
    prevStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },
    goToStep: (state, action) => {
      const step = action.payload;
      if (step >= 1 && step <= state.totalSteps) {
        state.currentStep = step;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch keluarga list
      .addCase(fetchKeluarga.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchKeluarga.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchKeluarga.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch keluarga detail
      .addCase(fetchKeluargaDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchKeluargaDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.detail = action.payload;
      })
      .addCase(fetchKeluargaDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create keluarga
      .addCase(createKeluarga.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createKeluarga.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createSuccess = true;
        state.list.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createKeluarga.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })
      
      // Update keluarga
      .addCase(updateKeluarga.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateKeluarga.fulfilled, (state, action) => {
        state.isLoading = false;
        state.updateSuccess = true;
        
        const index = state.list.findIndex(item => item.id_keluarga === action.payload.id_keluarga);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        
        if (state.detail && state.detail.keluarga && state.detail.keluarga.id_keluarga === action.payload.id_keluarga) {
          state.detail.keluarga = action.payload;
        }
      })
      .addCase(updateKeluarga.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      
      // Delete keluarga
      .addCase(deleteKeluarga.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteKeluarga.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deleteSuccess = true;
        state.list = state.list.filter(item => item.id_keluarga !== action.payload);
        state.pagination.total -= 1;
        
        if (state.detail && state.detail.keluarga && state.detail.keluarga.id_keluarga === action.payload) {
          state.detail = null;
        }
      })
      .addCase(deleteKeluarga.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.deleteSuccess = false;
      })
      
      // Fetch dropdown data
      .addCase(fetchDropdownData.pending, (state) => {
        state.isLoadingDropdowns = true;
        state.error = null;
      })
      .addCase(fetchDropdownData.fulfilled, (state, action) => {
        state.isLoadingDropdowns = false;
        state.dropdowns = action.payload;
      })
      .addCase(fetchDropdownData.rejected, (state, action) => {
        state.isLoadingDropdowns = false;
        state.error = action.payload;
      })
      
      // Fetch wilbin by kacab
      .addCase(fetchWilbinByKacab.pending, (state) => {
        state.isLoadingDropdowns = true;
        state.error = null;
      })
      .addCase(fetchWilbinByKacab.fulfilled, (state, action) => {
        state.isLoadingDropdowns = false;
        state.wilbinOptions = action.payload;
      })
      .addCase(fetchWilbinByKacab.rejected, (state, action) => {
        state.isLoadingDropdowns = false;
        state.error = action.payload;
      })
      
      // Fetch shelter by wilbin
      .addCase(fetchShelterByWilbin.pending, (state) => {
        state.isLoadingDropdowns = true;
        state.error = null;
      })
      .addCase(fetchShelterByWilbin.fulfilled, (state, action) => {
        state.isLoadingDropdowns = false;
        state.shelterOptions = action.payload;
      })
      .addCase(fetchShelterByWilbin.rejected, (state, action) => {
        state.isLoadingDropdowns = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { 
  resetKeluargaState, 
  clearKeluargaDetail,
  updateFormData,
  resetFormData,
  nextStep,
  prevStep,
  goToStep
} = keluargaSlice.actions;

// Export reducer
export default keluargaSlice.reducer;
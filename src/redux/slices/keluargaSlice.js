// src/redux/slices/keluargaSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { keluargaApi } from '../../api';

// Async thunks
export const fetchKeluarga = createAsyncThunk(
  'keluarga/fetchAll',
  async ({ page = 1, search = '', id_wilbin = '', id_kacab = '', loadMore = false }, { rejectWithValue }) => {
    try {
      const response = await keluargaApi.getAll({ page, search, id_wilbin, id_kacab });
      return {
        data: response.data,
        pagination: response.pagination,
        loadMore
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch keluarga data');
    }
  }
);

export const fetchKeluargaById = createAsyncThunk(
  'keluarga/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await keluargaApi.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch keluarga details');
    }
  }
);

export const createKeluarga = createAsyncThunk(
  'keluarga/create',
  async (keluargaData, { rejectWithValue }) => {
    try {
      const response = await keluargaApi.create(keluargaData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create keluarga');
    }
  }
);

export const updateKeluarga = createAsyncThunk(
  'keluarga/update',
  async ({ id, keluargaData }, { rejectWithValue }) => {
    try {
      const response = await keluargaApi.update(id, keluargaData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update keluarga');
    }
  }
);

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

export const fetchDropdownData = createAsyncThunk(
  'keluarga/fetchDropdownData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await keluargaApi.getDropdownData();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch dropdown data');
    }
  }
);

export const fetchWilbinByKacab = createAsyncThunk(
  'keluarga/fetchWilbinByKacab',
  async (id_kacab, { rejectWithValue }) => {
    try {
      const response = await keluargaApi.getWilbinByKacab(id_kacab);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch wilbin data');
    }
  }
);

export const fetchShelterByWilbin = createAsyncThunk(
  'keluarga/fetchShelterByWilbin',
  async (id_wilbin, { rejectWithValue }) => {
    try {
      const response = await keluargaApi.getShelterByWilbin(id_wilbin);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch shelter data');
    }
  }
);

// Slice
const keluargaSlice = createSlice({
  name: 'keluarga',
  initialState: {
    list: [],
    selectedKeluarga: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 10,
      from: null,
      to: null
    },
    dropdownData: {
      kacab: [],
      bank: []
    },
    wilbinOptions: [],
    shelterOptions: [],
    isLoading: false,
    isLoadingMore: false,
    isLoadingDetails: false,
    isLoadingDropdowns: false,
    isLoadingWilbin: false,
    isLoadingShelter: false,
    error: null,
    createSuccess: false,
    updateSuccess: false,
    deleteSuccess: false,
    // Form state for multi-step form
    formData: {
      // Keluarga data
      keluarga: {
        no_kk: '',
        kepala_keluarga: '',
        status_ortu: '',
        id_kacab: null,
        id_wilbin: null,
        id_shelter: null,
        id_bank: null,
        no_rek: '',
        an_rek: '',
        no_tlp: '',
        an_tlp: '',
        bank_choice: 'yes',
        telp_choice: 'yes'
      },
      // Ayah data
      ayah: {
        nik_ayah: '',
        nama_ayah: '',
        agama_ayah: '',
        tempat_lahir_ayah: '',
        tanggal_lahir_ayah: '',
        alamat_ayah: '',
        id_prov_ayah: '',
        id_kab_ayah: '',
        id_kec_ayah: '',
        id_kel_ayah: '',
        penghasilan_ayah: '',
        tanggal_kematian_ayah: '',
        penyebab_kematian_ayah: ''
      },
      // Ibu data
      ibu: {
        nik_ibu: '',
        nama_ibu: '',
        agama_ibu: '',
        tempat_lahir_ibu: '',
        tanggal_lahir_ibu: '',
        alamat_ibu: '',
        id_prov_ibu: '',
        id_kab_ibu: '',
        id_kec_ibu: '',
        id_kel_ibu: '',
        penghasilan_ibu: '',
        tanggal_kematian_ibu: '',
        penyebab_kematian_ibu: ''
      },
      // Wali data
      wali: {
        nik_wali: '',
        nama_wali: '',
        agama_wali: '',
        tempat_lahir_wali: '',
        tanggal_lahir_wali: '',
        alamat_wali: '',
        id_prov_wali: '',
        id_kab_wali: '',
        id_kec_wali: '',
        id_kel_wali: '',
        penghasilan_wali: '',
        hub_kerabat_wali: ''
      },
      // Anak data
      anak: {
        nik_anak: '',
        anak_ke: '',
        dari_bersaudara: '',
        nick_name: '',
        full_name: '',
        agama: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
        tinggal_bersama: '',
        jenis_anak_binaan: '',
        hafalan: '',
        pelajaran_favorit: '',
        hobi: '',
        prestasi: '',
        jarak_rumah: '',
        transportasi: '',
        foto: null
      },
      // Pendidikan data
      pendidikan: {
        jenjang: '',
        kelas: '',
        nama_sekolah: '',
        alamat_sekolah: '',
        jurusan: '',
        semester: '',
        nama_pt: '',
        alamat_pt: ''
      },
      currentStep: 0
    }
  },
  reducers: {
    resetKeluargaState: (state) => {
      state.error = null;
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },
    clearSelectedKeluarga: (state) => {
      state.selectedKeluarga = null;
    },
    setFormData: (state, action) => {
      const { section, data } = action.payload;
      state.formData[section] = {
        ...state.formData[section],
        ...data
      };
    },
    nextFormStep: (state) => {
      state.formData.currentStep += 1;
    },
    prevFormStep: (state) => {
      if (state.formData.currentStep > 0) {
        state.formData.currentStep -= 1;
      }
    },
    resetFormData: (state) => {
      state.formData = {
        keluarga: {
          no_kk: '',
          kepala_keluarga: '',
          status_ortu: '',
          id_kacab: null,
          id_wilbin: null,
          id_shelter: null,
          id_bank: null,
          no_rek: '',
          an_rek: '',
          no_tlp: '',
          an_tlp: '',
          bank_choice: 'yes',
          telp_choice: 'yes'
        },
        ayah: {
          nik_ayah: '',
          nama_ayah: '',
          agama_ayah: '',
          tempat_lahir_ayah: '',
          tanggal_lahir_ayah: '',
          alamat_ayah: '',
          id_prov_ayah: '',
          id_kab_ayah: '',
          id_kec_ayah: '',
          id_kel_ayah: '',
          penghasilan_ayah: '',
          tanggal_kematian_ayah: '',
          penyebab_kematian_ayah: ''
        },
        ibu: {
          nik_ibu: '',
          nama_ibu: '',
          agama_ibu: '',
          tempat_lahir_ibu: '',
          tanggal_lahir_ibu: '',
          alamat_ibu: '',
          id_prov_ibu: '',
          id_kab_ibu: '',
          id_kec_ibu: '',
          id_kel_ibu: '',
          penghasilan_ibu: '',
          tanggal_kematian_ibu: '',
          penyebab_kematian_ibu: ''
        },
        wali: {
          nik_wali: '',
          nama_wali: '',
          agama_wali: '',
          tempat_lahir_wali: '',
          tanggal_lahir_wali: '',
          alamat_wali: '',
          id_prov_wali: '',
          id_kab_wali: '',
          id_kec_wali: '',
          id_kel_wali: '',
          penghasilan_wali: '',
          hub_kerabat_wali: ''
        },
        anak: {
          nik_anak: '',
          anak_ke: '',
          dari_bersaudara: '',
          nick_name: '',
          full_name: '',
          agama: '',
          tempat_lahir: '',
          tanggal_lahir: '',
          jenis_kelamin: '',
          tinggal_bersama: '',
          jenis_anak_binaan: '',
          hafalan: '',
          pelajaran_favorit: '',
          hobi: '',
          prestasi: '',
          jarak_rumah: '',
          transportasi: '',
          foto: null
        },
        pendidikan: {
          jenjang: '',
          kelas: '',
          nama_sekolah: '',
          alamat_sekolah: '',
          jurusan: '',
          semester: '',
          nama_pt: '',
          alamat_pt: ''
        },
        currentStep: 0
      };
    },
    initFormDataFromKeluarga: (state, action) => {
      const keluargaData = action.payload;
      
      if (keluargaData) {
        // Initialize keluarga data
        state.formData.keluarga = {
          no_kk: keluargaData.keluarga?.no_kk || '',
          kepala_keluarga: keluargaData.keluarga?.kepala_keluarga || '',
          status_ortu: keluargaData.keluarga?.status_ortu || '',
          id_kacab: keluargaData.keluarga?.id_kacab || null,
          id_wilbin: keluargaData.keluarga?.id_wilbin || null,
          id_shelter: keluargaData.keluarga?.id_shelter || null,
          id_bank: keluargaData.keluarga?.id_bank || null,
          no_rek: keluargaData.keluarga?.no_rek || '',
          an_rek: keluargaData.keluarga?.an_rek || '',
          no_tlp: keluargaData.keluarga?.no_tlp || '',
          an_tlp: keluargaData.keluarga?.an_tlp || '',
          bank_choice: keluargaData.keluarga?.id_bank ? 'yes' : 'no',
          telp_choice: keluargaData.keluarga?.no_tlp ? 'yes' : 'no'
        };
        
        // Initialize ayah data
        if (keluargaData.keluarga?.ayah) {
          state.formData.ayah = {
            nik_ayah: keluargaData.keluarga.ayah.nik_ayah || '',
            nama_ayah: keluargaData.keluarga.ayah.nama_ayah || '',
            agama_ayah: keluargaData.keluarga.ayah.agama || '',
            tempat_lahir_ayah: keluargaData.keluarga.ayah.tempat_lahir || '',
            tanggal_lahir_ayah: keluargaData.keluarga.ayah.tanggal_lahir || '',
            alamat_ayah: keluargaData.keluarga.ayah.alamat || '',
            id_prov_ayah: keluargaData.keluarga.ayah.id_prov || '',
            id_kab_ayah: keluargaData.keluarga.ayah.id_kab || '',
            id_kec_ayah: keluargaData.keluarga.ayah.id_kec || '',
            id_kel_ayah: keluargaData.keluarga.ayah.id_kel || '',
            penghasilan_ayah: keluargaData.keluarga.ayah.penghasilan || '',
            tanggal_kematian_ayah: keluargaData.keluarga.ayah.tanggal_kematian || '',
            penyebab_kematian_ayah: keluargaData.keluarga.ayah.penyebab_kematian || ''
          };
        }
        
        // Initialize ibu data
        if (keluargaData.keluarga?.ibu) {
          state.formData.ibu = {
            nik_ibu: keluargaData.keluarga.ibu.nik_ibu || '',
            nama_ibu: keluargaData.keluarga.ibu.nama_ibu || '',
            agama_ibu: keluargaData.keluarga.ibu.agama || '',
            tempat_lahir_ibu: keluargaData.keluarga.ibu.tempat_lahir || '',
            tanggal_lahir_ibu: keluargaData.keluarga.ibu.tanggal_lahir || '',
            alamat_ibu: keluargaData.keluarga.ibu.alamat || '',
            id_prov_ibu: keluargaData.keluarga.ibu.id_prov || '',
            id_kab_ibu: keluargaData.keluarga.ibu.id_kab || '',
            id_kec_ibu: keluargaData.keluarga.ibu.id_kec || '',
            id_kel_ibu: keluargaData.keluarga.ibu.id_kel || '',
            penghasilan_ibu: keluargaData.keluarga.ibu.penghasilan || '',
            tanggal_kematian_ibu: keluargaData.keluarga.ibu.tanggal_kematian || '',
            penyebab_kematian_ibu: keluargaData.keluarga.ibu.penyebab_kematian || ''
          };
        }
        
        // Initialize wali data
        if (keluargaData.keluarga?.wali) {
          state.formData.wali = {
            nik_wali: keluargaData.keluarga.wali.nik_wali || '',
            nama_wali: keluargaData.keluarga.wali.nama_wali || '',
            agama_wali: keluargaData.keluarga.wali.agama || '',
            tempat_lahir_wali: keluargaData.keluarga.wali.tempat_lahir || '',
            tanggal_lahir_wali: keluargaData.keluarga.wali.tanggal_lahir || '',
            alamat_wali: keluargaData.keluarga.wali.alamat || '',
            id_prov_wali: keluargaData.keluarga.wali.id_prov || '',
            id_kab_wali: keluargaData.keluarga.wali.id_kab || '',
            id_kec_wali: keluargaData.keluarga.wali.id_kec || '',
            id_kel_wali: keluargaData.keluarga.wali.id_kel || '',
            penghasilan_wali: keluargaData.keluarga.wali.penghasilan || '',
            hub_kerabat_wali: keluargaData.keluarga.wali.hub_kerabat || ''
          };
        }
        
        // We don't set anak data here as this is for editing family details,
        // not children. Children are managed separately.
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchKeluarga
      .addCase(fetchKeluarga.pending, (state, action) => {
        if (action.meta.arg.loadMore) {
          state.isLoadingMore = true;
        } else {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchKeluarga.fulfilled, (state, action) => {
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
      .addCase(fetchKeluarga.rejected, (state, action) => {
        if (action.meta.arg.loadMore) {
          state.isLoadingMore = false;
        } else {
          state.isLoading = false;
        }
        state.error = action.payload;
      })
      
      // fetchKeluargaById
      .addCase(fetchKeluargaById.pending, (state) => {
        state.isLoadingDetails = true;
        state.error = null;
      })
      .addCase(fetchKeluargaById.fulfilled, (state, action) => {
        state.isLoadingDetails = false;
        state.selectedKeluarga = action.payload;
      })
      .addCase(fetchKeluargaById.rejected, (state, action) => {
        state.isLoadingDetails = false;
        state.error = action.payload;
      })
      
      // createKeluarga
      .addCase(createKeluarga.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createKeluarga.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createSuccess = true;
        // Don't add to list as the user likely won't be on the list screen
      })
      .addCase(createKeluarga.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })
      
      // updateKeluarga
      .addCase(updateKeluarga.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateKeluarga.fulfilled, (state, action) => {
        state.isLoading = false;
        state.updateSuccess = true;
        
        // Update in list if present
        const updatedKeluarga = action.payload;
        const index = state.list.findIndex(k => k.id_keluarga === updatedKeluarga.id_keluarga);
        if (index !== -1) {
          state.list[index] = updatedKeluarga;
        }
        
        // Update selected keluarga if it's the one being viewed
        if (state.selectedKeluarga && state.selectedKeluarga.keluarga.id_keluarga === updatedKeluarga.id_keluarga) {
          state.selectedKeluarga.keluarga = updatedKeluarga;
        }
      })
      .addCase(updateKeluarga.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      
      // deleteKeluarga
      .addCase(deleteKeluarga.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteKeluarga.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deleteSuccess = true;
        
        // Remove from list
        state.list = state.list.filter(k => k.id_keluarga !== action.payload);
        
        // Clear selected keluarga if it's the one deleted
        if (state.selectedKeluarga && state.selectedKeluarga.keluarga.id_keluarga === action.payload) {
          state.selectedKeluarga = null;
        }
      })
      .addCase(deleteKeluarga.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.deleteSuccess = false;
      })
      
      // fetchDropdownData
      .addCase(fetchDropdownData.pending, (state) => {
        state.isLoadingDropdowns = true;
        state.error = null;
      })
      .addCase(fetchDropdownData.fulfilled, (state, action) => {
        state.isLoadingDropdowns = false;
        state.dropdownData = action.payload;
      })
      .addCase(fetchDropdownData.rejected, (state, action) => {
        state.isLoadingDropdowns = false;
        state.error = action.payload;
      })
      
      // fetchWilbinByKacab
      .addCase(fetchWilbinByKacab.pending, (state) => {
        state.isLoadingWilbin = true;
        state.error = null;
      })
      .addCase(fetchWilbinByKacab.fulfilled, (state, action) => {
        state.isLoadingWilbin = false;
        state.wilbinOptions = action.payload;
      })
      .addCase(fetchWilbinByKacab.rejected, (state, action) => {
        state.isLoadingWilbin = false;
        state.error = action.payload;
      })
      
      // fetchShelterByWilbin
      .addCase(fetchShelterByWilbin.pending, (state) => {
        state.isLoadingShelter = true;
        state.error = null;
      })
      .addCase(fetchShelterByWilbin.fulfilled, (state, action) => {
        state.isLoadingShelter = false;
        state.shelterOptions = action.payload;
      })
      .addCase(fetchShelterByWilbin.rejected, (state, action) => {
        state.isLoadingShelter = false;
        state.error = action.payload;
      });
  }
});

export const { 
  resetKeluargaState, 
  clearSelectedKeluarga, 
  setFormData,
  nextFormStep,
  prevFormStep,
  resetFormData,
  initFormDataFromKeluarga
} = keluargaSlice.actions;

export default keluargaSlice.reducer;
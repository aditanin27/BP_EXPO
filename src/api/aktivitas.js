// src/api/aktivitas.js
import { fetchWithAuth } from './utils';

export const aktivitasApi = {
  /**
   * Get list of aktivitas with filtering and pagination
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  getAll: async (params = {}) => {
    const { 
      page = 1, 
      search = '', 
      jenis_kegiatan = '',
      id_shelter = '',
      per_page = 10
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
      ...(search && { search }),
      ...(jenis_kegiatan && { jenis_kegiatan }),
      ...(id_shelter && { id_shelter }),
    });

    return fetchWithAuth(`/aktivitas?${queryParams}`);
  },

  /**
   * Get a specific aktivitas by ID
   * @param {number|string} id - Aktivitas ID
   * @returns {Promise} - API response
   */
  getById: async (id) => {
    return fetchWithAuth(`/aktivitas/${id}`);
  },

  /**
   * Create a new aktivitas
   * @param {Object} aktivitasData - Aktivitas data
   * @returns {Promise} - API response
   */
  create: async (aktivitasData) => {
    // Check if any file fields are present
    const isFileUpload = 
      aktivitasData.foto_1 instanceof File || 
      aktivitasData.foto_2 instanceof File || 
      aktivitasData.foto_3 instanceof File;
    
    // If there are files, use FormData
    if (isFileUpload) {
      const formData = new FormData();
      
      // Add text fields to formData
      Object.keys(aktivitasData).forEach(key => {
        if (
          key !== 'foto_1' && 
          key !== 'foto_2' && 
          key !== 'foto_3' &&
          aktivitasData[key] !== undefined &&
          aktivitasData[key] !== null
        ) {
          formData.append(key, aktivitasData[key]);
        }
      });
      
      // Add foto files if they exist
      if (aktivitasData.foto_1 instanceof File) {
        formData.append('foto_1', aktivitasData.foto_1);
      }
      
      if (aktivitasData.foto_2 instanceof File) {
        formData.append('foto_2', aktivitasData.foto_2);
      }
      
      if (aktivitasData.foto_3 instanceof File) {
        formData.append('foto_3', aktivitasData.foto_3);
      }
      
      return fetchWithAuth('/aktivitas/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
    } 
    // If no files, send as JSON
    else {
      return fetchWithAuth('/aktivitas/create', {
        method: 'POST',
        body: JSON.stringify(aktivitasData),
      });
    }
  },

  /**
   * Update an existing aktivitas
   * @param {number|string} id - Aktivitas ID
   * @param {Object} aktivitasData - Updated aktivitas data
   * @returns {Promise} - API response
   */
  update: async (id, aktivitasData) => {
    // Check if any file fields are present
    const isFileUpload = 
      aktivitasData.foto_1 instanceof File || 
      aktivitasData.foto_2 instanceof File || 
      aktivitasData.foto_3 instanceof File;
    
    // If there are files, use FormData
    if (isFileUpload) {
      const formData = new FormData();
      
      // Add text fields to formData
      Object.keys(aktivitasData).forEach(key => {
        if (
          key !== 'foto_1' && 
          key !== 'foto_2' && 
          key !== 'foto_3' &&
          key !== 'hapus_foto_1' &&
          key !== 'hapus_foto_2' &&
          key !== 'hapus_foto_3' &&
          aktivitasData[key] !== undefined &&
          aktivitasData[key] !== null
        ) {
          formData.append(key, aktivitasData[key]);
        }
      });
      
      // Add foto files if they exist
      if (aktivitasData.foto_1 instanceof File) {
        formData.append('foto_1', aktivitasData.foto_1);
      }
      
      if (aktivitasData.foto_2 instanceof File) {
        formData.append('foto_2', aktivitasData.foto_2);
      }
      
      if (aktivitasData.foto_3 instanceof File) {
        formData.append('foto_3', aktivitasData.foto_3);
      }
      
      // Add delete flags for photos if they exist
      if (aktivitasData.hapus_foto_1) {
        formData.append('hapus_foto_1', '1');
      }
      
      if (aktivitasData.hapus_foto_2) {
        formData.append('hapus_foto_2', '1');
      }
      
      if (aktivitasData.hapus_foto_3) {
        formData.append('hapus_foto_3', '1');
      }
      
      return fetchWithAuth(`/aktivitas/update/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
    } 
    // If no files, send as JSON
    else {
      return fetchWithAuth(`/aktivitas/update/${id}`, {
        method: 'POST',
        body: JSON.stringify(aktivitasData),
      });
    }
  },

  /**
   * Delete an aktivitas
   * @param {number|string} id - Aktivitas ID
   * @returns {Promise} - API response
   */
  delete: async (id) => {
    return fetchWithAuth(`/aktivitas/delete/${id}`, {
      method: 'DELETE',
    });
  },
  
  /**
   * Upload a single foto for an aktivitas
   * @param {number|string} id - Aktivitas ID
   * @param {number} fotoNumber - Foto number (1, 2, or 3)
   * @param {File} fotoData - The foto file to upload
   * @returns {Promise} - API response
   */
  uploadFoto: async (id, fotoNumber, fotoData) => {
    const formData = new FormData();
    formData.append('foto_number', fotoNumber.toString());
    formData.append('foto', fotoData);
    
    return fetchWithAuth(`/aktivitas/upload-foto/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  },
  
  /**
   * Get list of kelompok for form selection
   * @returns {Promise} - API response with kelompok list
   */
  getKelompokList: async () => {
    return fetchWithAuth('/kelompok');
  }
};
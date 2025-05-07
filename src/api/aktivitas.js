// src/api/aktivitas.js
import { fetchWithAuth, createFormData } from './utils';

export const aktivitasApi = {
  /**
   * Get list of aktivitas with optional filtering and pagination
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  getAll: async (params = {}) => {
    const { 
      page = 1, 
      search = '', 
      id_shelter = '',
      jenis_kegiatan = '',
      per_page = 10
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
      ...(search && { search }),
      ...(id_shelter && { id_shelter }),
      ...(jenis_kegiatan && { jenis_kegiatan }),
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
   * @param {Object} aktivitasData - Aktivitas data including possible image files
   * @returns {Promise} - API response
   */
  create: async (aktivitasData) => {
    const formData = new FormData();
    
    // Add all text fields to formData
    Object.keys(aktivitasData).forEach(key => {
      if (!['foto_1', 'foto_2', 'foto_3'].includes(key)) {
        formData.append(key, aktivitasData[key]);
      }
    });
    
    // Add photos if they exist
    ['foto_1', 'foto_2', 'foto_3'].forEach(fieldName => {
      if (aktivitasData[fieldName] && typeof aktivitasData[fieldName] !== 'string') {
        const fileUri = aktivitasData[fieldName].uri;
        const filename = fileUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';
        
        formData.append(fieldName, {
          uri: fileUri,
          name: filename,
          type,
        });
      }
    });
    
    return fetchWithAuth('/aktivitas/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  },

  /**
   * Update an existing aktivitas
   * @param {number|string} id - Aktivitas ID
   * @param {Object} aktivitasData - Aktivitas data including possible image files
   * @returns {Promise} - API response
   */
  update: async (id, aktivitasData) => {
    const formData = new FormData();
    
    // Add all text fields to formData
    Object.keys(aktivitasData).forEach(key => {
      if (!['foto_1', 'foto_2', 'foto_3'].includes(key)) {
        formData.append(key, aktivitasData[key]);
      }
    });
    
    // Add photos if they exist
    ['foto_1', 'foto_2', 'foto_3'].forEach(fieldName => {
      if (aktivitasData[fieldName] && typeof aktivitasData[fieldName] !== 'string') {
        const fileUri = aktivitasData[fieldName].uri;
        const filename = fileUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';
        
        formData.append(fieldName, {
          uri: fileUri,
          name: filename,
          type,
        });
      }
    });
    
    // Handle photo deletion flags
    ['hapus_foto_1', 'hapus_foto_2', 'hapus_foto_3'].forEach(fieldName => {
      if (aktivitasData[fieldName]) {
        formData.append(fieldName, aktivitasData[fieldName]);
      }
    });
    
    return fetchWithAuth(`/aktivitas/update/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
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
   * Upload photos to an existing aktivitas
   * @param {number|string} id - Aktivitas ID
   * @param {Object} photoData - Object containing foto_1, foto_2, foto_3 fields
   * @returns {Promise} - API response
   */
  uploadFoto: async (id, photoData) => {
    const formData = new FormData();
    
    // Add photos to the form data
    ['foto_1', 'foto_2', 'foto_3'].forEach(fieldName => {
      if (photoData[fieldName] && typeof photoData[fieldName] !== 'string') {
        const fileUri = photoData[fieldName].uri;
        const filename = fileUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';
        
        formData.append(fieldName, {
          uri: fileUri,
          name: filename,
          type,
        });
      }
    });
    
    return fetchWithAuth(`/aktivitas/${id}/upload-foto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  },
  
  
};
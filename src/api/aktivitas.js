// src/api/aktivitas.js
import { fetchWithAuth, createFormData } from './utils';

export const aktivitasApi = {
  /**
   * Get list of aktivitas with optional filtering and pagination
   * @param {Object} params - Search and pagination params
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
    // Check if there are file uploads
    const hasFiles = aktivitasData.foto_1 || aktivitasData.foto_2 || aktivitasData.foto_3;
    
    if (hasFiles) {
      // Create form data for file uploads
      const formData = new FormData();
      
      // Add all text fields to formData
      Object.keys(aktivitasData).forEach(key => {
        if (!key.startsWith('foto_') || typeof aktivitasData[key] === 'string') {
          formData.append(key, aktivitasData[key]);
        }
      });
      
      // Add foto files if they exist
      ['foto_1', 'foto_2', 'foto_3'].forEach(fotoKey => {
        if (aktivitasData[fotoKey] && typeof aktivitasData[fotoKey] !== 'string') {
          const file = aktivitasData[fotoKey];
          const fileUri = file.uri;
          const filename = fileUri.split('/').pop();
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image';
          
          formData.append(fotoKey, {
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
    } else {
      // If no file uploads, send as JSON
      return fetchWithAuth('/aktivitas/create', {
        method: 'POST',
        body: JSON.stringify(aktivitasData),
      });
    }
  },

  /**
   * Update an existing aktivitas
   * @param {number|string} id - Aktivitas ID
   * @param {Object} aktivitasData - Aktivitas data including possible image files
   * @returns {Promise} - API response
   */
  update: async (id, aktivitasData) => {
    // Check if there are file uploads
    const hasFiles = aktivitasData.foto_1 || aktivitasData.foto_2 || aktivitasData.foto_3;
    
    if (hasFiles) {
      // Create form data for file uploads
      const formData = new FormData();
      
      // Add all text fields to formData
      Object.keys(aktivitasData).forEach(key => {
        if (!key.startsWith('foto_') || typeof aktivitasData[key] === 'string') {
          formData.append(key, aktivitasData[key]);
        }
      });
      
      // Add foto files if they exist
      ['foto_1', 'foto_2', 'foto_3'].forEach(fotoKey => {
        if (aktivitasData[fotoKey] && typeof aktivitasData[fotoKey] !== 'string') {
          const file = aktivitasData[fotoKey];
          const fileUri = file.uri;
          const filename = fileUri.split('/').pop();
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image';
          
          formData.append(fotoKey, {
            uri: fileUri,
            name: filename,
            type,
          });
        }
      });
      
      // Add photo deletion flags if present
      ['hapus_foto_1', 'hapus_foto_2', 'hapus_foto_3'].forEach(hapusKey => {
        if (aktivitasData[hapusKey]) {
          formData.append(hapusKey, aktivitasData[hapusKey]);
        }
      });
      
      return fetchWithAuth(`/aktivitas/update/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
    } else {
      // If no file uploads, send as JSON
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
   * Upload photos to an existing aktivitas
   * @param {number|string} id - Aktivitas ID
   * @param {Object} photoData - Object containing photo files
   * @returns {Promise} - API response
   */
  uploadFoto: async (id, photoData) => {
    const formData = new FormData();
    
    // Add foto files if they exist
    ['foto_1', 'foto_2', 'foto_3'].forEach(fotoKey => {
      if (photoData[fotoKey] && typeof photoData[fotoKey] !== 'string') {
        const file = photoData[fotoKey];
        const fileUri = file.uri;
        const filename = fileUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';
        
        formData.append(fotoKey, {
          uri: fileUri,
          name: filename,
          type,
        });
      }
    });
    
    return fetchWithAuth(`/aktivitas/upload-foto/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  }
};
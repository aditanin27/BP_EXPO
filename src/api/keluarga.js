// src/api/keluarga.js
import { fetchWithAuth, createFormData } from './utils';

export const keluargaApi = {
  /**
   * Get list of families with pagination and filtering
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  getAll: async (params = {}) => {
    const { 
      page = 1, 
      search = '', 
      id_shelter = '',
      id_wilbin = '',
      id_kacab = '',
      per_page = 10
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
      ...(search && { search }),
      ...(id_shelter && { id_shelter }),
      ...(id_wilbin && { id_wilbin }),
      ...(id_kacab && { id_kacab }),
    });

    return fetchWithAuth(`/keluarga?${queryParams}`);
  },

  /**
   * Get family details by ID
   * @param {number|string} id - Family ID
   * @returns {Promise} - API response
   */
  getById: async (id) => {
    return fetchWithAuth(`/keluarga/${id}`);
  },

  /**
   * Create new family record
   * @param {Object} data - Family and related data
   * @returns {Promise} - API response
   */
  create: async (data) => {
    // Check if we have file upload (for child photo)
    const hasFileUpload = data.foto && typeof data.foto !== 'string';
    
    if (hasFileUpload) {
      const formData = createFormData(data);
      return fetchWithAuth('/keluarga/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
    } else {
      return fetchWithAuth('/keluarga/create', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  },

  /**
   * Update family record
   * @param {number|string} id - Family ID
   * @param {Object} data - Family data
   * @returns {Promise} - API response
   */
  update: async (id, data) => {
    const hasFileUpload = data.foto && typeof data.foto !== 'string';
    
    if (hasFileUpload) {
      const formData = createFormData(data);
      return fetchWithAuth(`/keluarga/update/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
    } else {
      return fetchWithAuth(`/keluarga/update/${id}`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  },

  /**
   * Delete family record
   * @param {number|string} id - Family ID
   * @returns {Promise} - API response
   */
  delete: async (id) => {
    return fetchWithAuth(`/keluarga/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get form dropdown data (kacab, banks)
   * @returns {Promise} - API response
   */
  getDropdownData: async () => {
    return fetchWithAuth('/keluarga/dropdowns');
  },

  /**
   * Get wilbin options based on selected kacab
   * @param {number|string} idKacab - Kacab ID
   * @returns {Promise} - API response
   */
  getWilbinByKacab: async (idKacab) => {
    return fetchWithAuth(`/keluarga/wilbin/${idKacab}`);
  },

  /**
   * Get shelter options based on selected wilbin
   * @param {number|string} idWilbin - Wilbin ID
   * @returns {Promise} - API response
   */
  getShelterByWilbin: async (idWilbin) => {
    return fetchWithAuth(`/keluarga/shelter/${idWilbin}`);
  }
};
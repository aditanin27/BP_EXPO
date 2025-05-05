// src/api/keluarga.js
import { fetchWithAuth, createFormData } from './utils';

export const keluargaApi = {
  /**
   * Get all families with optional filtering and pagination
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  getAll: async (params = {}) => {
    const { 
      page = 1, 
      search = '', 
      id_wilbin = '',
      id_kacab = '',
      per_page = 10
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
      ...(search && { search }),
      ...(id_wilbin && { id_wilbin }),
      ...(id_kacab && { id_kacab }),
    });

    return fetchWithAuth(`/keluarga?${queryParams}`);
  },

  /**
   * Get a specific family by ID
   * @param {number|string} id - Family ID
   * @returns {Promise} - API response
   */
  getById: async (id) => {
    return fetchWithAuth(`/keluarga/${id}`);
  },

  /**
   * Create a new family
   * @param {Object} keluargaData - Family data
   * @returns {Promise} - API response
   */
  create: async (keluargaData) => {
    // Handle file uploads if present in the data
    const isFileUpload = keluargaData.foto && typeof keluargaData.foto !== 'string';
    
    if (isFileUpload) {
      const formData = createFormData(keluargaData);
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
        body: JSON.stringify(keluargaData),
      });
    }
  },

  /**
   * Update an existing family
   * @param {number|string} id - Family ID
   * @param {Object} keluargaData - Family data to update
   * @returns {Promise} - API response
   */
  update: async (id, keluargaData) => {
    // Handle file uploads if present in the data
    const isFileUpload = keluargaData.foto && typeof keluargaData.foto !== 'string';
    
    if (isFileUpload) {
      const formData = createFormData(keluargaData);
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
        body: JSON.stringify(keluargaData),
      });
    }
  },

  /**
   * Delete a family
   * @param {number|string} id - Family ID
   * @returns {Promise} - API response
   */
  delete: async (id) => {
    return fetchWithAuth(`/keluarga/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get dropdown data for forms (kacab, bank)
   * @returns {Promise} - API response with dropdown data
   */
  getDropdownData: async () => {
    return fetchWithAuth('/keluarga/dropdowns');
  },

  /**
   * Get wilbin options based on selected kacab
   * @param {number|string} id_kacab - Kacab ID
   * @returns {Promise} - API response with wilbin options
   */
  getWilbinByKacab: async (id_kacab) => {
    return fetchWithAuth(`/keluarga/wilbin/${id_kacab}`);
  },

  /**
   * Get shelter options based on selected wilbin
   * @param {number|string} id_wilbin - Wilbin ID
   * @returns {Promise} - API response with shelter options
   */
  getShelterByWilbin: async (id_wilbin) => {
    return fetchWithAuth(`/keluarga/shelter/${id_wilbin}`);
  }
};
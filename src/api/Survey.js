// src/api/survey.js
import { fetchWithAuth } from './utils';

export const surveyApi = {
  /**
   * Get list of families without survey or all surveys
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  getAll: async (params = {}) => {
    const { 
      page = 1, 
      search = '', 
      show_all = false,
      per_page = 10
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
      ...(search && { search }),
      ...(show_all && { show_all: 'true' }),
    });

    return fetchWithAuth(`/survey?${queryParams}`);
  },

  /**
   * Get a specific survey by family ID
   * @param {number|string} id_keluarga - Family ID
   * @returns {Promise} - API response
   */
  getById: async (id_keluarga) => {
    return fetchWithAuth(`/survey/${id_keluarga}`);
  },

  /**
   * Create or update a survey for a family
   * @param {number|string} id_keluarga - Family ID
   * @param {Object} surveyData - Survey data
   * @returns {Promise} - API response
   */
  create: async (id_keluarga, surveyData) => {
    return fetchWithAuth(`/survey/${id_keluarga}`, {
      method: 'POST',
      body: JSON.stringify(surveyData),
    });
  },

  /**
   * Delete a survey for a family
   * @param {number|string} id_keluarga - Family ID
   * @returns {Promise} - API response
   */
  delete: async (id_keluarga) => {
    return fetchWithAuth(`/survey/${id_keluarga}`, {
      method: 'DELETE',
    });
  }
};
// src/api/surveyValidasi.js
import { fetchWithAuth } from './utils';

export const surveyValidasiApi = {
  /**
   * Get surveys that need validation for the current admin's shelter
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  getAll: async (params = {}) => {
    const { 
      page = 1, 
      search = '', 
      status = '',
      per_page = 10
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
      ...(search && { search }),
      ...(status && { status }),
    });

    return fetchWithAuth(`/survey-validasi?${queryParams}`);
  },

  /**
   * Submit validation for a survey
   * @param {number|string} id_survey - Survey ID
   * @param {Object} validationData - Validation data with hasil_survey and keterangan_hasil
   * @returns {Promise} - API response
   */
  validateSurvey: async (id_survey, validationData) => {
    return fetchWithAuth(`/survey-validasi/${id_survey}`, {
      method: 'POST',
      body: JSON.stringify(validationData),
    });
  },

  /**
   * Get validation summary statistics
   * @returns {Promise} - API response with validation stats
   */
  getValidationSummary: async () => {
    return fetchWithAuth('/survey-validasi/summary');
  }
};
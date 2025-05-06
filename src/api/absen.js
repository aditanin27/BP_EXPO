// src/api/absen.js
import { fetchWithAuth } from './utils';

export const absenApi = {
  /**
   * Get list of absensi with filtering options
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  getAll: async (params = {}) => {
    const { 
      page = 1, 
      id_shelter = '',
      id_aktivitas = '',
      per_page = 10
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
      ...(id_shelter && { id_shelter }),
      ...(id_aktivitas && { id_aktivitas }),
    });

    return fetchWithAuth(`/absen?${queryParams}`);
  },

  /**
   * Get absensi data for a specific aktivitas
   * @param {number|string} id_aktivitas - Aktivitas ID
   * @returns {Promise} - API response
   */
  getByAktivitas: async (id_aktivitas) => {
    return fetchWithAuth(`/absen/by-aktivitas/${id_aktivitas}`);
  },

  /**
   * Get children by shelter for absensi purposes
   * @param {number|string} id_shelter - Shelter ID
   * @returns {Promise} - API response with list of children
   */
  getAnakByShelter: async (id_shelter) => {
    return fetchWithAuth(`/absen/shelter/${id_shelter}`);
  },

  /**
   * Create new absensi records
   * @param {Object} absenData - Object containing aktivitas ID and absensi data
   * @param {number|string} absenData.id_aktivitas - Aktivitas ID
   * @param {Array} absenData.absen_data - Array of absensi data objects
   * @returns {Promise} - API response
   */
  create: async (absenData) => {
    return fetchWithAuth('/absen/create', {
      method: 'POST',
      body: JSON.stringify(absenData),
    });
  },

  /**
   * Update existing absensi records
   * @param {number|string} id_aktivitas - Aktivitas ID
   * @param {Object} absenData - Object containing absensi data
   * @param {Array} absenData.absen_data - Array of absensi data objects
   * @returns {Promise} - API response
   */
  update: async (id_aktivitas, absenData) => {
    return fetchWithAuth(`/absen/update/${id_aktivitas}`, {
      method: 'POST',
      body: JSON.stringify(absenData),
    });
  },

  /**
   * Get summary of absensi records
   * @param {Object} params - Query parameters for summary
   * @param {string} [params.start_date] - Start date for summary period
   * @param {string} [params.end_date] - End date for summary period
   * @returns {Promise} - API response with summary data
   */
  getSummary: async (params = {}) => {
    const { 
      start_date = '',
      end_date = ''
    } = params;

    const queryParams = new URLSearchParams({
      ...(start_date && { start_date }),
      ...(end_date && { end_date }),
    });

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchWithAuth(`/absen/summary${queryString}`);
  }
};
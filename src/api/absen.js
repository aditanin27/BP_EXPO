// src/api/absen.js
import { fetchWithAuth } from './utils';

export const absenApi = {
  /**
   * Get absensi list for a specific aktivitas
   * @param {number|string} id_aktivitas - ID of the aktivitas
   * @returns {Promise} - API response with absensi data
   */
  getByAktivitas: async (id_aktivitas) => {
    return fetchWithAuth(`/absen/by-aktivitas/${id_aktivitas}`);
  },

  /**
   * Submit attendance for children in an activity
   * @param {number|string} id_aktivitas - ID of the aktivitas
   * @param {Array} absenData - Array of attendance objects {id_anak, status_absen}
   * @returns {Promise} - API response
   */
  submitAbsen: async (id_aktivitas, absenData) => {
    return fetchWithAuth(`/absen/submit/${id_aktivitas}`, {
      method: 'POST',
      body: JSON.stringify({ absen: absenData }),
    });
  },

  /**
   * Update attendance status for a child in an activity
   * @param {number|string} id_aktivitas - ID of the aktivitas
   * @param {number|string} id_anak - ID of the child
   * @param {string} status_absen - Attendance status ('Ya', 'Tidak', 'Izin')
   * @returns {Promise} - API response
   */
  updateAbsenStatus: async (id_aktivitas, id_anak, status_absen) => {
    return fetchWithAuth(`/absen/update-status/${id_aktivitas}/${id_anak}`, {
      method: 'POST',
      body: JSON.stringify({ status_absen }),
    });
  },
  
  /**
   * Get available children for attendance based on group or shelter
   * @param {number|string} id_aktivitas - ID of the aktivitas
   * @returns {Promise} - API response with available children
   */
  getAvailableChildren: async (id_aktivitas) => {
    return fetchWithAuth(`/absen/available-children/${id_aktivitas}`);
  }
};
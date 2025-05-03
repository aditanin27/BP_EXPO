// src/api/tutor.js
import { fetchWithAuth } from './utils';

export const tutorApi = {
  /**
   * Get all tutors with pagination and filtering
   * @param {Object} params - Query parameters
   * @param {number} [params.page=1] - Page to retrieve
   * @param {string} [params.search=''] - Search query
   * @param {number} [params.id_shelter=''] - Filter by shelter ID
   * @param {number} [params.per_page=10] - Items per page
   * @returns {Promise} - API response
   */
  getAll: async (params = {}) => {
    const { 
      page = 1, 
      search = '', 
      id_shelter = '',
      per_page = 10 
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
      ...(search && { search }),
      ...(id_shelter && { id_shelter }),
    });

    return fetchWithAuth(`/tutor?${queryParams}`);
  },

  /**
   * Get tutor details by ID
   * @param {number|string} id - Tutor ID
   * @returns {Promise} - API response
   */
  getById: async (id) => {
    return fetchWithAuth(`/tutor/${id}`);
  },

  /**
   * Create new tutor
   * @param {Object} tutorData - Tutor data
   * @returns {Promise} - API response
   */
  create: async (tutorData) => {
    const isFileUpload = tutorData.foto && typeof tutorData.foto !== 'string';
    
    if (isFileUpload) {
      const formData = createFormData(tutorData);
      return fetchWithAuth('/tutor/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
    } else {
      return fetchWithAuth('/tutor/create', {
        method: 'POST',
        body: JSON.stringify(tutorData),
      });
    }
  },

  /**
   * Update tutor
   * @param {number|string} id - Tutor ID
   * @param {Object} tutorData - Updated tutor data
   * @returns {Promise} - API response
   */
  update: async (id, tutorData) => {
    const isFileUpload = tutorData.foto && typeof tutorData.foto !== 'string';
    
    if (isFileUpload) {
      const formData = createFormData(tutorData);
      return fetchWithAuth(`/tutor/update/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
    } else {
      return fetchWithAuth(`/tutor/update/${id}`, {
        method: 'POST',
        body: JSON.stringify(tutorData),
      });
    }
  },

  /**
   * Delete tutor
   * @param {number|string} id - Tutor ID
   * @returns {Promise} - API response
   */
  delete: async (id) => {
    return fetchWithAuth(`/tutor/delete/${id}`, {
      method: 'DELETE',
    });
  },
};
// src/api/tutor.js
import { fetchWithAuth, createFormData } from './utils';

export const tutorApi = {
  /**
   * Get list of tutors with optional filtering and pagination
   * @param {Object} params - Search and pagination params
   * @returns {Promise} - API response
   */
  getAll: async (params = {}) => {
    const { 
      page = 1, 
      search = '', 
      per_page = 10
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
      ...(search && { search }),
    });

    return fetchWithAuth(`/tutor?${queryParams}`);
  },

  /**
   * Get a specific tutor by ID
   * @param {number|string} id - Tutor ID
   * @returns {Promise} - API response
   */
  getById: async (id) => {
    return fetchWithAuth(`/tutor/${id}`);
  },

  /**
   * Create a new tutor
   * @param {Object} tutorData - Tutor data including possible image file
   * @returns {Promise} - API response
   */
  create: async (tutorData) => {
    const isFileUpload = tutorData.foto && typeof tutorData.foto !== 'string';
    
    if (isFileUpload) {
      const formData = new FormData();
      
      // Add all text fields to formData
      Object.keys(tutorData).forEach(key => {
        if (key !== 'foto') {
          formData.append(key, tutorData[key]);
        }
      });
      
      // Add foto if it exists
      if (tutorData.foto) {
        const fileUri = tutorData.foto.uri;
        const filename = fileUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';
        
        formData.append('foto', {
          uri: fileUri,
          name: filename,
          type,
        });
      }
      
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
   * Update an existing tutor
   * @param {number|string} id - Tutor ID
   * @param {Object} tutorData - Tutor data including possible image file
   * @returns {Promise} - API response
   */
  update: async (id, tutorData) => {
    const isFileUpload = tutorData.foto && typeof tutorData.foto !== 'string';
    
    if (isFileUpload) {
      const formData = new FormData();
      
      // Add all text fields to formData
      Object.keys(tutorData).forEach(key => {
        if (key !== 'foto') {
          formData.append(key, tutorData[key]);
        }
      });
      
      // Add foto if it exists
      if (tutorData.foto) {
        const fileUri = tutorData.foto.uri;
        const filename = fileUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';
        
        formData.append('foto', {
          uri: fileUri,
          name: filename,
          type,
        });
      }
      
      return fetchWithAuth(`/tutor/update/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
    } else {
      // Don't include the 'foto' field at all if it's null or undefined
      // to prevent overwriting the existing photo
      const dataToSend = { ...tutorData };
      if (dataToSend.foto === null || dataToSend.foto === undefined) {
        delete dataToSend.foto;
      }
      
      return fetchWithAuth(`/tutor/update/${id}`, {
        method: 'POST',
        body: JSON.stringify(dataToSend),
      });
    }
  },

  /**
   * Delete a tutor
   * @param {number|string} id - Tutor ID
   * @returns {Promise} - API response
   */
  delete: async (id) => {
    return fetchWithAuth(`/tutor/delete/${id}`, {
      method: 'DELETE',
    });
  },
};
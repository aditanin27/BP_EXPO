// src/api/tutor.js
import { fetchWithAuth, createFormData } from './utils';

export const tutorApi = {
  getAll: async (params = {}) => {
    const { page = 1, search = '' } = params;
    const queryParams = new URLSearchParams({
      page,
      ...(search && { search }),
    });

    return fetchWithAuth(`/tutor?${queryParams}`);
  },

  getById: async (id) => {
    return fetchWithAuth(`/tutor/${id}`);
  },

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

  delete: async (id) => {
    return fetchWithAuth(`/tutor/delete/${id}`, {
      method: 'DELETE',
    });
  },
};
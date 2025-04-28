// src/api/suratAb.js
import { fetchWithAuth, createFormData } from './utils';

export const suratAbApi = {
  getAll: async (params = {}) => {
    const { 
      page = 1, 
      id_anak = '' 
    } = params;

    const queryParams = new URLSearchParams({
      page,
      ...(id_anak && { id_anak }),
    });

    return fetchWithAuth(`/surat-ab?${queryParams}`);
  },

  getById: async (id) => {
    return fetchWithAuth(`/surat-ab/${id}`);
  },

  create: async (suratData) => {
    const isFileUpload = suratData.foto && typeof suratData.foto !== 'string';
    
    if (isFileUpload) {
      const formData = createFormData(suratData);
      return fetchWithAuth('/surat-ab/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
    } else {
      return fetchWithAuth('/surat-ab/create', {
        method: 'POST',
        body: JSON.stringify(suratData),
      });
    }
  },

  update: async (id, suratData) => {
    const isFileUpload = suratData.foto && typeof suratData.foto !== 'string';
    
    if (isFileUpload) {
      const formData = createFormData(suratData);
      return fetchWithAuth(`/surat-ab/update/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
    } else {
      return fetchWithAuth(`/surat-ab/update/${id}`, {
        method: 'POST',
        body: JSON.stringify(suratData),
      });
    }
  },

  delete: async (id) => {
    return fetchWithAuth(`/surat-ab/delete/${id}`, {
      method: 'DELETE',
    });
  },
};
// src/api/anak.js
import { fetchWithAuth, createFormData } from './utils';

export const anakApi = {
  getAll: async (params = {}) => {
    const { page = 1, search = '', status = '' } = params;
    const queryParams = new URLSearchParams({
      page,
      ...(search && { search }),
      ...(status && { status }),
    });

    return fetchWithAuth(`/anak?${queryParams}`);
  },

  getById: async (id) => {
    return fetchWithAuth(`/anak/${id}`);
  },

  create: async (dataAnak) => {
    const isFileUpload = dataAnak.foto && typeof dataAnak.foto !== 'string';
    
    if (isFileUpload) {
      const formData = createFormData(dataAnak);
      return fetchWithAuth('/anak/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
    } else {
      return fetchWithAuth('/anak/create', {
        method: 'POST',
        body: JSON.stringify(dataAnak),
      });
    }
  },

  update: async (id, dataAnak) => {
    const isFileUpload = dataAnak.foto && typeof dataAnak.foto !== 'string';
    
    if (isFileUpload) {
      const formData = createFormData(dataAnak);
      return fetchWithAuth(`/anak/update/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
    } else {
      return fetchWithAuth(`/anak/update/${id}`, {
        method: 'POST',
        body: JSON.stringify(dataAnak),
      });
    }
  },

  delete: async (id) => {
    return fetchWithAuth(`/anak/delete/${id}`, {
      method: 'DELETE',
    });
  },
};
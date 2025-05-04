// src/api/prestasi.js
import { fetchWithAuth, createFormData } from './utils';

export const prestasiApi = {
  getAll: async (params = {}) => {
    const { 
      page = 1, 
      id_anak = '', 
      jenis_prestasi = '', 
      level_prestasi = '' 
    } = params;

    const queryParams = new URLSearchParams({
      page,
      ...(id_anak && { id_anak }),
      ...(jenis_prestasi && { jenis_prestasi }),
      ...(level_prestasi && { level_prestasi }),
    });

    return fetchWithAuth(`/prestasi?${queryParams}`);
  },

  getById: async (id) => {
    return fetchWithAuth(`/prestasi/${id}`);
  },

  create: async (prestasiData) => {
    const isFileUpload = prestasiData.foto && typeof prestasiData.foto !== 'string';
    
    if (isFileUpload) {
      const formData = createFormData(prestasiData);
      return fetchWithAuth('/prestasi/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
    } else {
      return fetchWithAuth('/prestasi/create', {
        method: 'POST',
        body: JSON.stringify(prestasiData),
      });
    }
  },

  update: async (id, prestasiData) => {
    const isFileUpload = prestasiData.foto && typeof prestasiData.foto !== 'string';
    
    if (isFileUpload) {
      const formData = createFormData(prestasiData);
      return fetchWithAuth(`/prestasi/update/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
    } else {
      return fetchWithAuth(`/prestasi/update/${id}`, {
        method: 'POST',
        body: JSON.stringify(prestasiData),
      });
    }
  },

  delete: async (id) => {
    return fetchWithAuth(`/prestasi/delete/${id}`, {
      method: 'DELETE',
    });
  },
};
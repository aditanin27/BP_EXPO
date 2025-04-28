// src/api/kelompok.js
import { fetchWithAuth, createFormData } from './utils';

export const kelompokApi = {
  getAll: async (params = {}) => {
    const { 
      page = 1, 
      search = '', 
      id_shelter = '', 
      id_level_anak_binaan = '' 
    } = params;

    const queryParams = new URLSearchParams({
      page,
      ...(search && { search }),
      ...(id_shelter && { id_shelter }),
      ...(id_level_anak_binaan && { id_level_anak_binaan }),
    });

    return fetchWithAuth(`/kelompok?${queryParams}`);
  },

  getById: async (id) => {
    return fetchWithAuth(`/kelompok/${id}`);
  },

  create: async (kelompokData) => {
    return fetchWithAuth('/kelompok/create', {
      method: 'POST',
      body: JSON.stringify(kelompokData),
    });
  },

  update: async (id, kelompokData) => {
    return fetchWithAuth(`/kelompok/update/${id}`, {
      method: 'POST',
      body: JSON.stringify(kelompokData),
    });
  },

  delete: async (id) => {
    return fetchWithAuth(`/kelompok/delete/${id}`, {
      method: 'DELETE',
    });
  },
};
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
  
  getLevels: async () => {
    return fetchWithAuth('/kelompok/levels');
  },
  
  getAvailableChildren: async (id_shelter) => {
    return fetchWithAuth(`/kelompok/available-children/${id_shelter}`);
  },
  
  getGroupChildren: async (id_kelompok) => {
    return fetchWithAuth(`/kelompok/${id_kelompok}/anak`);
  },
  
  addChildToGroup: async (id_kelompok, id_anak) => {
    return fetchWithAuth(`/kelompok/${id_kelompok}/anak`, {
      method: 'POST',
      body: JSON.stringify({ id_anak }),
    });
  },
  
  removeChildFromGroup: async (id_kelompok, id_anak) => {
    return fetchWithAuth(`/kelompok/${id_kelompok}/anak/${id_anak}`, {
      method: 'DELETE',
    });
  },
  
  moveChildToShelter: async (id_anak, id_shelter_baru) => {
    return fetchWithAuth(`/kelompok/move-child/${id_anak}`, {
      method: 'POST',
      body: JSON.stringify({ id_shelter_baru }),
    });
  }
};
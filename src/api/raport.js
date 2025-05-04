// src/api/raport.js
import { fetchWithAuth } from './utils';

export const raportApi = {
  getAll: async (params = {}) => {
    const { page = 1, id_anak = '' } = params;
    const queryParams = new URLSearchParams({
      page,
      ...(id_anak && { id_anak }),
    });

    return fetchWithAuth(`/raport?${queryParams}`);
  },

  getById: async (id) => {
    return fetchWithAuth(`/raport/${id}`);
  },

  create: async (raportData) => {
    const formData = new FormData();
    
    // Add all data fields to the form data
    Object.keys(raportData).forEach(key => {
      if (key !== 'foto_rapor') {
        formData.append(key, raportData[key]);
      }
    });
    
    // Add photos if they exist
    if (raportData.foto_rapor && raportData.foto_rapor.length > 0) {
      raportData.foto_rapor.forEach((photo, index) => {
        const fileUri = photo.uri;
        const filename = fileUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';
        
        formData.append('foto_rapor[]', {
          uri: fileUri,
          name: filename,
          type,
        });
      });
    }
    
    return fetchWithAuth('/raport/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  },

  update: async (id, raportData) => {
    const formData = new FormData();
    
    // Add all data fields to the form data
    Object.keys(raportData).forEach(key => {
      if (key !== 'foto_rapor' && key !== 'hapus_foto') {
        formData.append(key, raportData[key]);
      }
    });
    
    // Add photos if they exist
    if (raportData.foto_rapor && raportData.foto_rapor.length > 0) {
      raportData.foto_rapor.forEach((photo, index) => {
        const fileUri = photo.uri;
        const filename = fileUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';
        
        formData.append('foto_rapor[]', {
          uri: fileUri,
          name: filename,
          type,
        });
      });
    }
    
    // Add photo IDs to delete if any
    if (raportData.hapus_foto && raportData.hapus_foto.length > 0) {
      raportData.hapus_foto.forEach(id => {
        formData.append('hapus_foto[]', id);
      });
    }
    
    return fetchWithAuth(`/raport/update/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  },

  delete: async (id) => {
    return fetchWithAuth(`/raport/delete/${id}`, {
      method: 'DELETE',
    });
  },
};
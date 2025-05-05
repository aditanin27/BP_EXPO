import { fetchWithAuth, createFormData } from './utils';

export const historiApi = {
  getAll: async (params = {}) => {
    const { 
      page = 1, 
      id_anak = '', 
      jenis_histori = '' 
    } = params;

    const queryParams = new URLSearchParams({
      page,
      ...(id_anak && { id_anak }),
      ...(jenis_histori && { jenis_histori }),
    });

    return fetchWithAuth(`/histori?${queryParams}`);
  },

  getById: async (id) => {
    return fetchWithAuth(`/histori/${id}`);
  },

  create: async (historiData) => {
    const isFileUpload = historiData.foto && typeof historiData.foto !== 'string';
    
    if (isFileUpload) {
      const formData = createFormData(historiData);
      return fetchWithAuth('/histori/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
    } else {
      return fetchWithAuth('/histori/create', {
        method: 'POST',
        body: JSON.stringify(historiData),
      });
    }
  },

  update: async (id, historiData) => {
    const isFileUpload = historiData.foto && typeof historiData.foto !== 'string';
    
    if (isFileUpload) {
      const formData = createFormData(historiData);
      return fetchWithAuth(`/histori/update/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
    } else {
      return fetchWithAuth(`/histori/update/${id}`, {
        method: 'POST',
        body: JSON.stringify(historiData),
      });
    }
  },

  delete: async (id) => {
    return fetchWithAuth(`/histori/delete/${id}`, {
      method: 'DELETE',
    });
  },
};
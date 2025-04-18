// ./src/api/index.js
import { getToken } from '../utils/storage';
import { API_BASE_URL } from '../utils/constants';

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const api = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  logout: async () => {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  getProfile: async () => {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
  
  // Fungsi-fungsi untuk API Anak
  getChildren: async () => {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/anak`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  getChildById: async (id) => {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/anak/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  createChild: async (childData) => {
    const token = await getToken();
    
    // Jika ada file foto, gunakan FormData
    if (childData.foto) {
      const formData = new FormData();
      
      // Tambahkan semua field ke formData
      Object.keys(childData).forEach(key => {
        if (key === 'foto') {
          // Untuk file foto
          const fileUri = childData.foto.uri;
          const filename = fileUri.split('/').pop();
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image';
          
          formData.append('foto', {
            uri: fileUri,
            name: filename,
            type,
          });
        } else {
          formData.append(key, childData[key]);
        }
      });
      
      const response = await fetch(`${API_BASE_URL}/anak/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      return handleResponse(response);
    } else {
      // Jika tidak ada foto, gunakan JSON biasa
      const response = await fetch(`${API_BASE_URL}/anak/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(childData),
      });
      return handleResponse(response);
    }
  },

  updateChild: async (id, childData) => {
    const token = await getToken();
    
    // Jika ada file foto, gunakan FormData
    if (childData.foto && typeof childData.foto !== 'string') {
      const formData = new FormData();
      
      // Tambahkan semua field ke formData
      Object.keys(childData).forEach(key => {
        if (key === 'foto' && typeof childData.foto !== 'string') {
          // Untuk file foto
          const fileUri = childData.foto.uri;
          const filename = fileUri.split('/').pop();
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image';
          
          formData.append('foto', {
            uri: fileUri,
            name: filename,
            type,
          });
        } else {
          formData.append(key, childData[key]);
        }
      });
      
      const response = await fetch(`${API_BASE_URL}/anak/update/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      return handleResponse(response);
    } else {
      // Jika tidak ada foto baru, gunakan JSON biasa
      const response = await fetch(`${API_BASE_URL}/anak/update/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(childData),
      });
      return handleResponse(response);
    }
  },

  deleteChild: async (id) => {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/anak/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};
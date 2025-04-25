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
  
  updateProfileImage: async (imageData) => {
    const token = await getToken();
    
    const formData = new FormData();
    
    const fileUri = imageData.uri;
    const filename = fileUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image';
    
    formData.append('foto', {
      uri: fileUri,
      name: filename,
      type,
    });
    
    const response = await fetch(`${API_BASE_URL}/update-profile-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    
    return handleResponse(response);
  },
  
  getChildren: async ({ page = 1, search = '', status = '' }) => {
    const token = await getToken();
    const url = new URL(`${API_BASE_URL}/anak`);
    
    // Add query parameters safely
    url.searchParams.set('page', page);
    if (search) url.searchParams.set('search', search);
    if (status) url.searchParams.set('status', status);
  
    const response = await fetch(url.toString(), {
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
    
    // Handle file upload with FormData
    if (childData.foto && typeof childData.foto !== 'string') {
      const formData = new FormData();
      
      // Append all fields to formData
      Object.keys(childData).forEach(key => {
        if (key === 'foto') {
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
      // If no photo, use regular JSON
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
    
    // Handle file upload with FormData
    if (childData.foto && typeof childData.foto !== 'string') {
      const formData = new FormData();
      
      // Append all fields to formData
      Object.keys(childData).forEach(key => {
        if (key === 'foto') {
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
      // If no new photo, use regular JSON
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

  getTutors: async ({ page = 1, search = '' }) => {
    const token = await getToken();
    const url = new URL(`${API_BASE_URL}/tutor`);
    
    // Add query parameters safely
    url.searchParams.set('page', page);
    if (search) url.searchParams.set('search', search);
  
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  getTutorDetail: async (id) => {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/tutor/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  createTutor: async (tutorData) => {
    const token = await getToken();
    
    // Handle file upload with FormData
    if (tutorData.foto && typeof tutorData.foto !== 'string') {
      const formData = new FormData();
      
      // Append all fields to formData
      Object.keys(tutorData).forEach(key => {
        if (key === 'foto') {
          const fileUri = tutorData.foto.uri;
          const filename = fileUri.split('/').pop();
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image';
          
          formData.append('foto', {
            uri: fileUri,
            name: filename,
            type,
          });
        } else {
          formData.append(key, tutorData[key]);
        }
      });
      
      const response = await fetch(`${API_BASE_URL}/tutor/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      return handleResponse(response);
    } else {
      // If no photo, use regular JSON
      const response = await fetch(`${API_BASE_URL}/tutor/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(tutorData),
      });
      return handleResponse(response);
    }
  },

  updateTutor: async (id, tutorData) => {
    const token = await getToken();
    
    // Handle file upload with FormData
    if (tutorData.foto && typeof tutorData.foto !== 'string') {
      const formData = new FormData();
      
      // Append all fields to formData
      Object.keys(tutorData).forEach(key => {
        if (key === 'foto') {
          const fileUri = tutorData.foto.uri;
          const filename = fileUri.split('/').pop();
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image';
          
          formData.append('foto', {
            uri: fileUri,
            name: filename,
            type,
          });
        } else {
          formData.append(key, tutorData[key]);
        }
      });
      
      const response = await fetch(`${API_BASE_URL}/tutor/update/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      return handleResponse(response);
    } else {
      // If no new photo, use regular JSON
      const response = await fetch(`${API_BASE_URL}/tutor/update/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(tutorData),
      });
      return handleResponse(response);
    }
  },

  deleteTutor: async (id) => {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/tutor/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};
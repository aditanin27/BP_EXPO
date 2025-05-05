// src/api/auth.js
import { saveToken, removeToken } from '../utils/storage';
import { fetchWithAuth } from './utils';

export const authApi = {
  login: async (credentials) => {
    const response = await fetch('https://bp.berbagipendidikan.org/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Save token if login successful
    if (data.success && data.token) {
      await saveToken(data.token);
    }

    return data;
  },
  
  logout: async () => {
    try {
      await fetchWithAuth('/logout', { method: 'POST' });
      await removeToken();
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      await removeToken(); // Always remove token even if logout API fails
      throw error;
    }
  },

  getProfile: async () => {
    return fetchWithAuth('/profile');
  },

  updateProfileImage: async (imageData) => {
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
    
    return fetchWithAuth('/update-profile-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  },
};
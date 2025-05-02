// src/api/utils.js
import { API_BASE_URL } from '../utils/constants';
import { getToken } from '../utils/storage';

export const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const prepareFileUpload = (file) => {
  const fileUri = file.uri;
  const filename = fileUri.split('/').pop();
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image';
  
  return {
    uri: fileUri,
    name: filename,
    type
  };
};

export const fetchWithAuth = async (url, options = {}) => {
  const token = await getToken();
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const mergedOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  try {
    const response = await fetch(fullUrl, mergedOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Fetch Error - Full Response:', {
        status: response.status,
        statusText: response.statusText,
        url: fullUrl,
        responseText: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}, text: ${errorText}`);
    }
    
    return handleResponse(response);
  } catch (error) {
    console.error('Fetch Authentication Error:', error);
    throw error;
  }
};

export const createFormData = (data) => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    if (key === 'foto' && data[key] && typeof data[key] !== 'string') {
      const fileData = prepareFileUpload(data[key]);
      formData.append('foto', fileData);
    } else {
      formData.append(key, data[key]);
    }
  });
  
  return formData;
};
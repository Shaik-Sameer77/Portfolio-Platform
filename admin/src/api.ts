import axios from 'axios';
import { encryptData, decryptData } from './utils/encryption';

const IS_ENCRYPTED = import.meta.env.VITE_ISENCRYPTED_PAYLOAD !== 'false';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: add token and encrypt payload
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (IS_ENCRYPTED && config.data && config.headers['Content-Type'] !== 'multipart/form-data') {
    config.data = { payload: encryptData(config.data) };
  }
  
  return config;
}, (error) => Promise.reject(error));

// Response interceptor: decrypt payload
api.interceptors.response.use((response) => {
  if (IS_ENCRYPTED && response.data && typeof response.data.result === 'string') {
    response.data = decryptData(response.data.result);
  }
  return response;
}, (error) => {
  if (IS_ENCRYPTED && error.response?.data?.result && typeof error.response.data.result === 'string') {
    error.response.data = decryptData(error.response.data.result);
  }
  if (error.response?.status === 401) {
    localStorage.removeItem('admin_token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default api;

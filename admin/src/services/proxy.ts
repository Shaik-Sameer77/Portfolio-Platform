import axios from 'axios';
import { encryptData, decryptData } from '../utils/encryption';

const IS_ENCRYPTED = import.meta.env.VITE_ISENCRYPTED_PAYLOAD !== 'false';

const proxy = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001',
  headers: {
    'Content-Type': 'application/json',
  },
});

proxy.interceptors.request.use((config) => {
  if (IS_ENCRYPTED && config.data && config.headers['Content-Type'] !== 'multipart/form-data') {
    config.data = { payload: encryptData(config.data) };
  }
  
  // Attach auth token when ready
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => Promise.reject(error));

proxy.interceptors.response.use((response) => {
  if (IS_ENCRYPTED && response.data && typeof response.data.result === 'string') {
    response.data = decryptData(response.data.result);
  }
  return response;
}, (error) => {
  if (IS_ENCRYPTED && error.response?.data?.result && typeof error.response.data.result === 'string') {
    error.response.data = decryptData(error.response.data.result);
  }
  return Promise.reject(error);
});

export default proxy;

import axios from 'axios';
import { encryptData, decryptData } from '@/utils/encryption';
import { useAuthStore } from '@/store/useAuthStore';

const IS_ENCRYPTED = process.env.NEXT_PUBLIC_ISENCRYPTED_PAYLOAD !== 'false';

const proxy = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://portfolio-platform-243j.vercel.app'
      : 'http://localhost:8001'),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

proxy.interceptors.request.use((config) => {
  if (IS_ENCRYPTED && config.data && config.headers['Content-Type'] !== 'multipart/form-data') {
    config.data = { payload: encryptData(config.data) };
  }
  
  return config;
}, (error) => Promise.reject(error));

proxy.interceptors.response.use((response) => {
  if (IS_ENCRYPTED && response.data && typeof response.data.result === 'string') {
    response.data = decryptData(response.data.result);
  }
  return response;
}, async (error) => {
  if (IS_ENCRYPTED && error.response?.data?.result && typeof error.response.data.result === 'string') {
    error.response.data = decryptData(error.response.data.result);
  }
  
  if (error.response?.status === 401) {
    const originalRequest = error.config;

    // Skip refresh attempts for auth endpoints to avoid infinite loops
    if (!originalRequest._retry && originalRequest.url !== '/auth/refresh' && originalRequest.url !== '/auth/login' && originalRequest.url !== '/auth/status') {
      originalRequest._retry = true;
      try {
        await proxy.post('/auth/refresh');
        return proxy(originalRequest);
      } catch (e) {
        // Refresh failed — clear local state only (don't call backend logout, cookies are already dead)
        useAuthStore.getState()._clearSession();
        return Promise.reject(e);
      }
    }

    // If we're here, it's a direct auth failure — clear local state only
    useAuthStore.getState()._clearSession();
  }
  
  return Promise.reject(error);
});

export default proxy;

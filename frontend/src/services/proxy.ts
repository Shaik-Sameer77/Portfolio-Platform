import axios from 'axios';
import { encryptData, decryptData } from '@/utils/encryption';
import { useAuthStore } from '@/store/useAuthStore';

const IS_ENCRYPTED = process.env.NEXT_PUBLIC_ISENCRYPTED_PAYLOAD !== 'false';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const { hostname, protocol } = window.location;
    // If testing from a mobile phone on a local Wi-Fi network (e.g. 192.168.x.x)
    if (
      hostname !== 'localhost' &&
      hostname !== '127.0.0.1' &&
      !hostname.endsWith('.vercel.app') &&
      !hostname.includes('vercel.app')
    ) {
      return `${protocol}//${hostname}:8001`;
    }
  }
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://portfolio-platform-243j.vercel.app'
      : 'http://localhost:8001')
  );
};

const proxy = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

proxy.interceptors.request.use((config) => {
  config.baseURL = getBaseUrl();
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
  const originalRequest = error.config;

  // Retry once on transient network errors (e.g. backend server reload / latency spike)
  if (error.message === 'Network Error' && originalRequest && !originalRequest._networkRetry) {
    originalRequest._networkRetry = true;
    await new Promise((r) => setTimeout(r, 600));
    return proxy(originalRequest);
  }

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

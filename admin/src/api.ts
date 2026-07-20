import axios from 'axios';
import { encryptData, decryptData } from './utils/encryption';

const IS_ENCRYPTED = import.meta.env.VITE_ISENCRYPTED_PAYLOAD !== 'false';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor: encrypt payload
api.interceptors.request.use((config) => {
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
}, async (error) => {
  if (IS_ENCRYPTED && error.response?.data?.result && typeof error.response.data.result === 'string') {
    error.response.data = decryptData(error.response.data.result);
  }
  if (error.response?.status === 401) {
    const originalRequest = error.config;

    if (!originalRequest._retry && originalRequest.url !== '/auth/refresh' && originalRequest.url !== '/auth/login' && originalRequest.url !== '/auth/status') {
      originalRequest._retry = true;
      try {
        await api.post('/auth/refresh');
        return api(originalRequest);
      } catch (e) {
        // Dynamic import to break circular dependency
        import('./store').then(({ store }) => {
          import('./features/authSlice').then(({ logout }) => {
            store.dispatch(logout());
          });
        });
        localStorage.clear(); // Clear any legacy data
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(e);
      }
    }

    // Dynamic import to break circular dependency
    import('./store').then(({ store }) => {
      import('./features/authSlice').then(({ logout }) => {
        store.dispatch(logout());
      });
    });
    localStorage.clear(); // Clear any legacy data
    
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
});

export default api;

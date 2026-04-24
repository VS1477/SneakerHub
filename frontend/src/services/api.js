import axios from 'axios';

const normalizeApiBaseUrl = (url) => {
  const baseUrl = (url || '/api').replace(/\/+$/, '');
  return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

const apiBaseUrl = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

const api = axios.create({
  baseURL: apiBaseUrl
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('sneakerhub_user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sneakerhub_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

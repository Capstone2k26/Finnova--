import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const auth = { token: useAuthStore.getState().token };
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.state.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('finnova-auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://lostandfound-backend-production-a81a.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Authorization header with JWT token for every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response error interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 413) {
      console.error('File size too large');
    }
    return Promise.reject(error);
  }
);

export default API;

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    accept: '*/*',
  },
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // already includes "Bearer " (from login)
    if (token) {
      config.headers.Authorization = token; // ✅ don't prepend again
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optionally redirect to auth page
      // window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;

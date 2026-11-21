import axios from 'axios';

// Dapatkan base URL dari environment variable atau gunakan relative /api untuk Vite proxy
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Interceptor Request: Tambahkan Bearer Token jika tersimpan
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('manhwaverse_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor Response: Ekstrak data dan tangani sesi kedaluwarsa
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Tangani token kedaluwarsa atau tidak valid
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
      const storedToken = localStorage.getItem('manhwaverse_token');
      if (storedToken) {
        localStorage.removeItem('manhwaverse_token');
        localStorage.removeItem('manhwaverse_user');
      }
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'Terjadi kesalahan saat berkomunikasi dengan server.';

    return Promise.reject(new Error(message));
  }
);

export default api;

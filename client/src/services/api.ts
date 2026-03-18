// client/src/services/api.ts
// REFACTOR:
// 1. withCredentials: true — cookie dikirim otomatis di setiap request
// 2. Tidak ada manual token injection dari localStorage
// 3. Response interceptor untuk handle 401 global

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env['VITE_API_BASE_URL'] ?? 'http://localhost:5000/api',
  withCredentials: true, // KRITIS: kirim HttpOnly cookie di setiap request
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor — handle 401 secara global
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Token expired atau tidak valid — redirect ke login
      // Hindari redirect loop jika sudah di halaman login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;

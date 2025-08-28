// /client/src/services/api.js (Versi Final)
import axios from 'axios';

// Kode ini secara cerdas akan menggunakan /api saat online (di Vercel) 
// dan http://localhost:5000/api saat di komputer Anda.
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default api;
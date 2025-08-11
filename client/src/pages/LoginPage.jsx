// /client/src/pages/LoginPage.jsx (Versi Final dengan SweetAlert)

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

// --- TAMBAHKAN IMPORT BARU DI SINI ---
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
// ------------------------------------

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // State error tidak lagi diperlukan karena kita menggunakan pop-up
    // const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, ...userData } = response.data;
            login(userData, token);

            // --- NOTIFIKASI SUKSES DENGAN SWEETALERT2 ---
            MySwal.fire({
                title: 'Login Berhasil!',
                text: `Selamat datang kembali, ${userData.name}!`,
                icon: 'success',
                timer: 2000,
            }).then(() => {
                // Navigasi ke halaman utama setelah notifikasi
                navigate('/');
            });

        } catch (err) {
            // --- NOTIFIKASI ERROR DENGAN SWEETALERT2 ---
            MySwal.fire({
                title: 'Login Gagal',
                text: err.response?.data?.message || 'Email atau password salah.',
                icon: 'error',
                confirmButtonColor: '#3085d6',
            });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Pesan error berbasis teks di sini sudah tidak diperlukan lagi */}
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
                    </div>
                    <button type="submit" className="w-full py-2 text-white bg-gray-800 rounded-md hover:bg-gray-900">Login</button>
                    <p className="text-sm text-center">
                        Belum punya akun? <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">Daftar di sini</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
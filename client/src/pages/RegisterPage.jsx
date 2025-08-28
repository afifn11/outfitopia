// /client/src/pages/RegisterPage.jsx (Versi Final dengan SweetAlert)

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Eye, EyeOff, UserPlus, User } from 'lucide-react';

const MySwal = withReactContent(Swal);

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await api.post('/auth/register', { name, email, password });
            const { token, ...userData } = response.data;
            login(userData, token);

            MySwal.fire({
                title: 'Pendaftaran Berhasil!',
                text: `Selamat datang, ${userData.name}!`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                navigate('/');
            });

        } catch (err) {
            MySwal.fire({
                title: 'Gagal Mendaftar',
                text: err.response?.data?.message || 'Terjadi kesalahan saat mendaftar.',
                icon: 'error',
                confirmButtonColor: '#C0A080',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-[#F0F0F0] p-6 sm:p-8">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-[#FAF5F0] rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="w-8 h-8 text-[#C0A080]" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#333333] mb-2">Daftar Akun Baru</h1>
                    <p className="text-[#666666] text-sm">Buat akun untuk mulai berbelanja</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-[#333333] mb-2">Nama Lengkap</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666666] w-5 h-5" />
                            <input 
                                type="text" 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                required 
                                className="w-full px-4 py-3 pl-10 border border-[#F0F0F0] rounded-lg focus:ring-2 focus:ring-[#C0A080] focus:border-[#C0A080] transition-colors duration-200 bg-[#FAFAFA] focus:bg-white"
                                placeholder="Masukkan nama lengkap Anda"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#333333] mb-2">Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                            className="w-full px-4 py-3 border border-[#F0F0F0] rounded-lg focus:ring-2 focus:ring-[#C0A080] focus:border-[#C0A080] transition-colors duration-200 bg-[#FAFAFA] focus:bg-white"
                            placeholder="Masukkan email Anda"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-[#333333] mb-2">Password</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                required 
                                className="w-full px-4 py-3 border border-[#F0F0F0] rounded-lg focus:ring-2 focus:ring-[#C0A080] focus:border-[#C0A080] transition-colors duration-200 bg-[#FAFAFA] focus:bg-white pr-12"
                                placeholder="Buat password yang kuat"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#666666] hover:text-[#C0A080] transition-colors duration-200"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full py-3 bg-[#C0A080] text-white font-medium rounded-lg hover:bg-[#B09070] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <UserPlus className="w-5 h-5 mr-2" />
                                Daftar
                            </>
                        )}
                    </button>

                    <div className="text-center pt-4 border-t border-[#F0F0F0]">
                        <p className="text-sm text-[#666666]">
                            Sudah punya akun?{' '}
                            <Link 
                                to="/login" 
                                className="font-medium text-[#C0A080] hover:text-[#B09070] transition-colors duration-200"
                            >
                                Login di sini
                            </Link>
                        </p>
                    </div>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-[#666666]">
                        © {new Date().getFullYear()} Outfitopia. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
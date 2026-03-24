import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Eye, EyeOff } from 'lucide-react';

const MySwal = withReactContent(Swal);
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const LoginPage = () => {
    const [email, setEmail]             = useState('');
    const [password, setPassword]       = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading]     = useState(false);
    const { login } = useAuth();
    const navigate  = useNavigate();
    const [searchParams] = useSearchParams();

    // Handle Google OAuth redirect
    useEffect(() => {
        const error = searchParams.get('error');
        if (error) {
            MySwal.fire({ title: 'Login Gagal', text: 'Login dengan Google gagal. Coba lagi.', icon: 'error', confirmButtonColor: '#0a0a0a' });
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            const { token, ...userData } = res.data;
            login(userData, token);
            MySwal.fire({ title: 'Welcome back!', text: userData.name, icon: 'success', timer: 1500, showConfirmButton: false })
                .then(() => navigate('/'));
        } catch (err) {
            MySwal.fire({ title: 'Login Failed', text: err.response?.data?.message || 'Invalid email or password.', icon: 'error', confirmButtonColor: '#0a0a0a' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        // Redirect to server Google OAuth endpoint
        window.location.href = `${API_URL.replace('/api', '')}/api/auth/google`;
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4 py-12 page-enter">
            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <Link to="/" className="text-[13px] font-semibold tracking-[0.18em] uppercase text-[#0a0a0a]">Outfitopia</Link>
                    <p className="label-sm text-[#a0a0a0] mt-6">Sign in to your account</p>
                </div>

                {/* Google OAuth Button */}
                <button onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 border border-[#e8e8e8] py-3 mb-6 text-[12px] text-[#444] hover:bg-[#fafafa] transition-colors">
                    <svg width="18" height="18" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    </svg>
                    Continue with Google
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-[#e8e8e8]" />
                    <span className="text-[11px] text-[#a0a0a0] uppercase tracking-wide">or</span>
                    <div className="flex-1 h-px bg-[#e8e8e8]" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block label-sm text-[#6b6b6b] mb-2">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                            className="input-minimal" placeholder="your@email.com" />
                    </div>
                    <div>
                        <label className="block label-sm text-[#6b6b6b] mb-2">Password</label>
                        <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                                className="input-minimal pr-10" placeholder="••••••••" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-0 top-1/2 -translate-y-1/2 text-[#a0a0a0] hover:text-[#0a0a0a] transition-colors">
                                {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" disabled={isLoading} className="btn-black w-full justify-center mt-2">
                        {isLoading
                            ? <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            : 'Sign in'}
                    </button>
                </form>

                <p className="text-center text-[12px] text-[#6b6b6b] mt-8">
                    No account?{' '}
                    <Link to="/register" className="text-[#0a0a0a] underline underline-offset-2 hover:opacity-70 transition-opacity">Create one</Link>
                </p>

                <div className="mt-8 pt-6 border-t border-[#e8e8e8] text-center">
                    <p className="text-[10px] text-[#a0a0a0] tracking-wide uppercase">Demo: afif@outfitopia.com / password123</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

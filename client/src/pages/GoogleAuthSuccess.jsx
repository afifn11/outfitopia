import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Halaman perantara setelah Google OAuth redirect
// URL: /auth/google/success?token=xxx&id=xxx&name=xxx&email=xxx&role=xxx
const GoogleAuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const { login } = useAuth();
    const navigate  = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        const id    = searchParams.get('id');
        const name  = decodeURIComponent(searchParams.get('name') || '');
        const email = decodeURIComponent(searchParams.get('email') || '');
        const role  = searchParams.get('role') || 'user';

        if (token && id) {
            login({ id: Number(id), name, email, role }, token);
            navigate('/', { replace: true });
        } else {
            navigate('/login?error=google_failed', { replace: true });
        }
    }, [searchParams, login, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-8 h-8 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[12px] tracking-wide uppercase text-[#a0a0a0]">Signing you in...</p>
            </div>
        </div>
    );
};

export default GoogleAuthSuccess;

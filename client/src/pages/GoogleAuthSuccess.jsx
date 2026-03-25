// client/src/pages/GoogleAuthSuccess.jsx
// Halaman perantara setelah Google OAuth redirect berhasil
import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GoogleAuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const { login }      = useAuth();
    const navigate       = useNavigate();
    const hasRun         = useRef(false); // Prevent double-execution in React StrictMode

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const token = searchParams.get('token');
        const id    = searchParams.get('id');
        const name  = searchParams.get('name')  || '';
        const email = searchParams.get('email') || '';
        const role  = searchParams.get('role')  || 'user';

        if (token && id) {
            login({ id: Number(id), name, email, role }, token);
            // navigate handled by LoginPage useEffect watching isAuthenticated
            navigate('/', { replace: true });
        } else {
            navigate('/login?error=google_failed', { replace: true });
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
            <div className="text-center">
                <div className="w-8 h-8 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[12px] tracking-wide uppercase text-[#a0a0a0]">Signing you in...</p>
            </div>
        </div>
    );
};

export default GoogleAuthSuccess;

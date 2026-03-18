// client/src/context/AuthContext.tsx
// REFACTOR:
// 1. Token tidak lagi disimpan di localStorage (rentan XSS)
// 2. Token disimpan di HttpOnly cookie oleh server — JS tidak bisa baca
// 3. GET /api/auth/me untuk restore session saat app load
// 4. TypeScript strict

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return ctx;
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session dari server saat app pertama kali load
  // Cookie dikirim otomatis oleh browser (withCredentials: true di api.ts)
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.get<{ success: boolean; data: User }>('/auth/me');
        if (res.data.success) setUser(res.data.data);
      } catch {
        // Token tidak ada atau expired — user belum login, itu normal
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void restoreSession();
  }, []);

  const login = useCallback((userData: User) => {
    setUser(userData);
    // TIDAK ada localStorage.setItem — token ada di HttpOnly cookie
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout'); // server hapus cookie
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: user !== null,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

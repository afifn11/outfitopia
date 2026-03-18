import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Eye, EyeOff } from 'lucide-react';

const MySwal = withReactContent(Swal);

const LoginPage = () => {
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
      const response = await api.post('/auth/login', { email, password });
      const { token, ...userData } = response.data;
      login(userData, token);
      MySwal.fire({ title: 'Welcome back!', text: userData.name, icon: 'success', timer: 1500, showConfirmButton: false })
        .then(() => navigate('/'));
    } catch (err) {
      MySwal.fire({ title: 'Login failed', text: err.response?.data?.message || 'Invalid email or password.', icon: 'error', confirmButtonColor: '#0a0a0a' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4 py-12 page-enter">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link to="/" className="text-[13px] font-semibold tracking-[0.18em] uppercase text-[#0a0a0a]">Outfitopia</Link>
          <p className="label-sm text-[#a0a0a0] mt-6">Sign in to your account</p>
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
            {isLoading ? <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-[12px] text-[#6b6b6b] mt-8">
          No account?{' '}
          <Link to="/register" className="text-[#0a0a0a] underline underline-offset-2 hover:opacity-70 transition-opacity">Create one</Link>
        </p>

        <div className="mt-8 pt-6 border-t border-[#e8e8e8] text-center">
          <p className="text-[10px] text-[#a0a0a0] tracking-wide uppercase">Demo: demo@outfitopia.com / password123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, BookOpen, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan kata sandi wajib diisi.');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);
      // Jika login sebagai admin, langsung arahkan ke Panel Kelola Admin (CRUD) tanpa perantara
      if (res?.data?.user?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from === '/login' ? '/' : from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 max-w-md mx-auto">
      <div className="bg-manhwa-card rounded-2xl border border-manhwa-border p-6 md:p-8 shadow-soft">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-manhwa-accent text-white flex items-center justify-center mx-auto mb-3 shadow-soft">
            <BookOpen className="w-7 h-7" />
          </div>
          <h2 className="font-serif font-bold text-2xl md:text-3xl text-manhwa-text">
            Masuk ke ManhwaVerse
          </h2>
          <p className="text-sm text-manhwa-muted mt-1.5">
            Lanjutkan catatan progres membaca manhwa favoritmu.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-manhwa-text mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-manhwa-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-manhwa-surface border border-manhwa-border text-sm md:text-base focus:outline-none focus:border-manhwa-accent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-manhwa-text mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-manhwa-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-manhwa-surface border border-manhwa-border text-sm md:text-base focus:outline-none focus:border-manhwa-accent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-manhwa-muted hover:text-manhwa-text transition-smooth p-1 cursor-pointer"
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                title={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-manhwa-accent text-white font-semibold text-sm md:text-base hover:bg-manhwa-accent-hover transition-smooth shadow-xs flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Memproses...' : 'Masuk'}</span>
          </button>
        </form>

        {/* Link to Register */}
        <div className="mt-6 pt-5 border-t border-manhwa-border/70 text-center text-sm text-manhwa-muted">
          Belum memiliki akun?{' '}
          <Link to="/register" className="text-manhwa-accent font-semibold hover:underline">
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
};

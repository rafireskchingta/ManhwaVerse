import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('manhwaverse_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('manhwaverse_token') || null);
  const [loading, setLoading] = useState(true);

  // Verifikasi token saat inisialisasi aplikasi
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('manhwaverse_token');
      if (storedToken) {
        try {
          const profile = await authService.getMe();
          setUser(profile);
          localStorage.setItem('manhwaverse_user', JSON.stringify(profile));
        } catch (error) {
          console.warn('Sesi login tidak valid:', error.message);
          setToken(null);
          setUser(null);
          localStorage.removeItem('manhwaverse_token');
          localStorage.removeItem('manhwaverse_user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.success && res.data) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('manhwaverse_token', res.data.token);
      localStorage.setItem('manhwaverse_user', JSON.stringify(res.data.user));
    }
    return res;
  };

  const register = async (name, email, password) => {
    const res = await authService.register({ name, email, password });
    if (res.success && res.data) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('manhwaverse_token', res.data.token);
      localStorage.setItem('manhwaverse_user', JSON.stringify(res.data.user));
    }
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setToken(null);
    setUser(null);
    localStorage.removeItem('manhwaverse_token');
    localStorage.removeItem('manhwaverse_user');
  };

  const updateUser = (updatedProfile) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedProfile };
      localStorage.setItem('manhwaverse_user', JSON.stringify(merged));
      return merged;
    });
  };

  const refreshProfile = async () => {
    const storedToken = localStorage.getItem('manhwaverse_token');
    if (storedToken) {
      try {
        const profile = await authService.getMe();
        setUser(profile);
        localStorage.setItem('manhwaverse_user', JSON.stringify(profile));
        return profile;
      } catch (e) {
        console.warn('Gagal refresh profile:', e.message);
      }
    }
    return null;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user && token),
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateUser,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

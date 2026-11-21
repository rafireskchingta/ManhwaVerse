import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Shield,
  Info,
  LogOut,
  LogIn,
  UserPlus,
  Edit3
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { trackerService } from '../services/trackerService';
import { profileService } from '../services/profileService';
import { Modal } from '../components/Modal';

export const ProfilePage = () => {
  const { user, isAuthenticated, isAdmin, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ total: 0, reading: 0, completed: 0 });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      trackerService.getStats().then(setStats).catch(console.error);
      if (user?.name) setNewName(user.name);
    }
  }, [isAuthenticated, user]);

  const handleConfirmLogout = async () => {
    setIsLogoutModalOpen(false);
    await logout();
    navigate('/');
  };

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      setIsUpdating(true);
      setEditError(null);
      await profileService.updateProfile({ name: newName.trim() });
      updateUser({ name: newName.trim() });
      setIsEditModalOpen(false);
    } catch (err) {
      setEditError(err.message || 'Gagal memperbarui profil.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      {/* Profil Pengguna */}
      {isAuthenticated && user ? (
        <section className="bg-manhwa-card rounded-2xl border border-manhwa-border p-5 md:p-7 shadow-soft">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-manhwa-accent/15 text-manhwa-accent font-serif font-bold text-2xl flex items-center justify-center border border-manhwa-border shadow-soft flex-shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>

            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-xl md:text-2xl text-manhwa-text truncate">
                  {user.name}
                </h2>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-1 rounded-md text-manhwa-muted hover:text-manhwa-text hover:bg-manhwa-surface transition-smooth cursor-pointer"
                  title="Ubah Nama"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-xs md:text-sm text-manhwa-muted mt-1">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>

              {/* Role Badge */}
              <div className="mt-2.5 flex items-center gap-2">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full border inline-flex items-center gap-1.5 ${
                    isAdmin
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-manhwa-surface text-manhwa-secondary border-manhwa-border'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{isAdmin ? 'Administrator' : 'Pembaca (Reader)'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Statistik Bacaan Pengguna */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-manhwa-border/70">
            <div className="bg-manhwa-surface rounded-xl p-3 text-center">
              <span className="text-xs text-manhwa-muted font-medium uppercase tracking-wider">
                Total Komik
              </span>
              <p className="font-serif font-bold text-xl md:text-2xl text-manhwa-text mt-1">
                {stats.total}
              </p>
            </div>
            <div className="bg-manhwa-surface rounded-xl p-3 text-center">
              <span className="text-xs text-amber-800 font-medium uppercase tracking-wider">
                Sedang Baca
              </span>
              <p className="font-serif font-bold text-xl md:text-2xl text-amber-900 mt-1">
                {stats.reading}
              </p>
            </div>
            <div className="bg-manhwa-surface rounded-xl p-3 text-center">
              <span className="text-xs text-emerald-800 font-medium uppercase tracking-wider">
                Selesai
              </span>
              <p className="font-serif font-bold text-xl md:text-2xl text-emerald-900 mt-1">
                {stats.completed}
              </p>
            </div>
          </div>

          {/* Tombol Keluar */}
          <div className="mt-5 pt-4 border-t border-manhwa-border/60">
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="w-full py-3 px-4 rounded-xl text-rose-700 bg-rose-50/70 hover:bg-rose-100 border border-rose-200/60 font-semibold text-sm flex items-center justify-center gap-2 transition-smooth cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar dari Akun</span>
            </button>
          </div>
        </section>
      ) : (
        /* Jika Belum Login */
        <section className="bg-manhwa-card rounded-2xl border border-manhwa-border p-6 md:p-8 text-center shadow-soft">
          <div className="w-16 h-16 rounded-2xl bg-manhwa-surface text-manhwa-accent flex items-center justify-center mx-auto mb-3 border border-manhwa-border">
            <User className="w-8 h-8" />
          </div>
          <h2 className="font-serif font-bold text-xl md:text-2xl text-manhwa-text">
            Bergabung dengan ManhwaVerse
          </h2>
          <p className="text-sm text-manhwa-muted mt-2 leading-relaxed max-w-sm mx-auto">
            Masuk untuk menyimpan catatan progres bacaan Anda, sinkronisasi antar perangkat, dan menikmati fitur lengkap.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3.5">
            <Link
              to="/login"
              className="py-3 px-4 rounded-xl bg-manhwa-accent text-white font-semibold text-sm hover:bg-manhwa-accent-hover transition-smooth flex items-center justify-center gap-2 shadow-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk</span>
            </Link>
            <Link
              to="/register"
              className="py-3 px-4 rounded-xl bg-manhwa-surface text-manhwa-text font-semibold text-sm hover:bg-manhwa-highlight border border-manhwa-border transition-smooth flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Daftar</span>
            </Link>
          </div>
        </section>
      )}

      {/* Informasi Aplikasi (About App) */}
      <section className="bg-manhwa-card rounded-2xl border border-manhwa-border p-5 md:p-7 shadow-soft space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-manhwa-border/70">
          <Info className="w-5 h-5 text-manhwa-secondary" />
          <h3 className="font-serif font-bold text-lg md:text-xl text-manhwa-text">
            Tentang Aplikasi ManhwaVerse
          </h3>
        </div>

        <div className="space-y-3.5 text-sm md:text-base text-manhwa-muted leading-relaxed">
          <p>
            <strong className="text-manhwa-text font-serif">ManhwaVerse</strong> adalah aplikasi direktori komik manhwa & manhua sekaligus pelacak bacaan (reading tracker) personal.
          </p>
          <p>
            Aplikasi ini dirancang untuk memudahkan para penggemar menjelajahi beragam judul komik pilihan, mencatat progres chapter bacaan, mengenal profil karakter utama, dan menemukan rekomendasi berdasarkan genre favorit.
          </p>
        </div>
      </section>

      {/* Modal Edit Nama */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditError(null);
        }}
        title="Ubah Nama Tampilan"
      >
        <form onSubmit={handleUpdateName} noValidate className="space-y-4">
          {editError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
              {editError}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-manhwa-text mb-1.5">
              Nama Lengkap / Panggilan
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-manhwa-surface border border-manhwa-border text-sm focus:outline-none focus:border-manhwa-accent"
              required
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditError(null);
              }}
              className="px-4 py-2.5 text-sm font-semibold rounded-lg bg-manhwa-surface text-manhwa-text hover:bg-manhwa-highlight border border-manhwa-border transition-smooth cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2.5 text-sm font-semibold rounded-lg bg-manhwa-accent text-white hover:bg-manhwa-accent-hover transition-smooth disabled:opacity-60 cursor-pointer"
            >
              {isUpdating ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Konfirmasi Keluar Akun */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Konfirmasi Keluar Akun"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-manhwa-muted leading-relaxed">
            Apakah Anda yakin ingin keluar dari akun <strong className="text-manhwa-text font-serif">{user?.name || 'Anda'}</strong>? Sesi Anda akan diakhiri dan Anda dapat masuk kembali kapan saja.
          </p>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(false)}
              className="px-4 py-2.5 text-sm font-semibold rounded-lg bg-manhwa-surface text-manhwa-text hover:bg-manhwa-highlight border border-manhwa-border transition-smooth cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirmLogout}
              className="px-4 py-2.5 text-sm font-semibold rounded-lg bg-rose-700 text-white hover:bg-rose-800 transition-smooth shadow-xs cursor-pointer"
            >
              Ya, Keluar Akun
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Users,
  CheckCircle,
  AlertCircle,
  ShieldAlert,
  Info
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { comicService } from '../services/comicService';
import { characterService } from '../services/characterService';
import { Modal } from '../components/Modal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';

export const AdminTrashPage = () => {
  const { user, isAdmin, loading: authLoading, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('comics'); // 'comics' | 'characters'
  const [trashedComics, setTrashedComics] = useState([]);
  const [trashedCharacters, setTrashedCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMsg, setAlertMsg] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);
  const [syncingRole, setSyncingRole] = useState(false);

  // Modal Action States
  const [restoreConfirm, setRestoreConfirm] = useState({
    isOpen: false,
    type: '', // 'comic' | 'character'
    id: null,
    title: ''
  });

  const [hardDeleteConfirm, setHardDeleteConfirm] = useState({
    isOpen: false,
    type: '', // 'comic' | 'character'
    id: null,
    title: ''
  });

  // Guard: hanya admin yang dapat mengakses & auto-sync jika role baru saja diubah
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login', { replace: true });
      } else if (!isAdmin) {
        refreshProfile?.().catch(() => {});
      }
    }
  }, [user, isAdmin, authLoading, navigate, refreshProfile]);

  const fetchTrashData = async () => {
    try {
      setLoading(true);
      const [comicsData, charsData] = await Promise.all([
        comicService.getTrash().catch(() => []),
        characterService.getTrash().catch(() => [])
      ]);
      setTrashedComics(comicsData);
      setTrashedCharacters(charsData);
    } catch (err) {
      console.error('Error saat memuat data sampah:', err);
      showAlert('error', 'Gagal memuat data dari kotak sampah.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchTrashData();
    }
  }, [isAdmin]);

  const showAlert = (type, text) => {
    setAlertMsg({ type, text });
    setTimeout(() => {
      setAlertMsg({ type: '', text: '' });
    }, 5000);
  };

  // ================= RESTORE HANDLER =================
  const handleExecuteRestore = async () => {
    const { type, id, title } = restoreConfirm;
    try {
      setSubmitting(true);
      if (type === 'comic') {
        await comicService.restore(id);
        showAlert('success', `Komik "${title}" berhasil dipulihkan ke katalog utama.`);
      } else if (type === 'character') {
        await characterService.restore(id);
        showAlert('success', `Karakter "${title}" berhasil dipulihkan ke katalog utama.`);
      }
      setRestoreConfirm({ isOpen: false, type: '', id: null, title: '' });
      await fetchTrashData();
    } catch (err) {
      showAlert('error', err.message || 'Gagal memulihkan data.');
    } finally {
      setSubmitting(false);
    }
  };

  // ================= HARD DELETE HANDLER =================
  const handleExecuteHardDelete = async () => {
    const { type, id, title } = hardDeleteConfirm;
    try {
      setSubmitting(true);
      if (type === 'comic') {
        await comicService.hardDelete(id);
        showAlert('success', `Komik "${title}" telah dihapus secara permanen dari database.`);
      } else if (type === 'character') {
        await characterService.hardDelete(id);
        showAlert('success', `Karakter "${title}" telah dihapus secara permanen dari database.`);
      }
      setHardDeleteConfirm({ isOpen: false, type: '', id: null, title: '' });
      await fetchTrashData();
    } catch (err) {
      showAlert('error', err.message || 'Gagal menghapus data secara permanen.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || (loading && isAdmin)) {
    return <LoadingSpinner message="Menyiapkan data kotak sampah..." />;
  }

  // Jika sudah login tapi role di session browser belum admin
  if (!authLoading && user && !isAdmin) {
    return (
      <div className="max-w-lg mx-auto my-10 p-6 bg-manhwa-card rounded-2xl border border-manhwa-border shadow-soft text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h3 className="font-serif font-bold text-xl text-manhwa-text">
          Akses Khusus Administrator
        </h3>
        <p className="text-sm text-manhwa-muted leading-relaxed">
          Akun Anda (<strong className="text-manhwa-text">{user.email}</strong>) saat ini masih terbaca dengan role <span className="px-2 py-0.5 rounded bg-manhwa-surface text-manhwa-secondary border border-manhwa-border font-semibold text-xs">reader</span>.
        </p>
        <div className="text-xs text-manhwa-muted leading-relaxed bg-manhwa-surface p-3.5 rounded-xl border border-manhwa-border text-left space-y-1.5">
          <p className="font-semibold text-manhwa-text">Sudah ubah role jadi admin di Supabase?</p>
          <p>
            Sesi browser Anda mungkin masih menyimpan role lama. Klik tombol di bawah untuk menyinkronkan status role langsung dari database Supabase:
          </p>
        </div>

        {alertMsg.text && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
              alertMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {alertMsg.type === 'success' ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{alertMsg.text}</span>
          </div>
        )}

        <div className="flex flex-col gap-2.5 pt-2">
          <button
            onClick={async () => {
              try {
                setSyncingRole(true);
                const p = await refreshProfile?.();
                if (p?.role === 'admin') {
                  showAlert('success', 'Status Administrator aktif! Memuat data...');
                  fetchTrashData();
                } else {
                  showAlert('error', 'Status di database masih "reader". Pastikan nilai role di tabel profiles bernilai "admin".');
                }
              } catch (e) {
                showAlert('error', 'Gagal menyinkronkan: ' + e.message);
              } finally {
                setSyncingRole(false);
              }
            }}
            disabled={syncingRole}
            className="w-full py-2.5 px-4 rounded-xl bg-manhwa-accent text-white font-semibold text-sm hover:bg-manhwa-accent-hover transition-smooth cursor-pointer shadow-xs disabled:opacity-60"
          >
            {syncingRole ? 'Memeriksa Database...' : 'Sinkronkan Status Akun Sekarang'}
          </button>
          <button
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-manhwa-surface text-rose-700 hover:bg-rose-50 border border-rose-200 font-semibold text-sm transition-smooth cursor-pointer"
          >
            Keluar (Logout) & Login Ulang
          </button>
        </div>
      </div>
    );
  }

  const defaultCover =
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
  const defaultPhoto =
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';

  return (
    <div className="space-y-6">
      {/* Header Halaman Sampah */}
      <section className="bg-manhwa-card rounded-2xl border border-manhwa-border p-5 md:p-7 shadow-soft">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs md:text-sm text-manhwa-muted hover:text-manhwa-text transition-smooth mb-2 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Panel Katalog Admin</span>
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 border border-rose-200/70 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold font-serif text-manhwa-text">
                  Kotak Sampah Komik & Karakter
                </h1>
                <p className="text-xs md:text-sm text-manhwa-muted mt-0.5">
                  Kelola data komik dan karakter yang telah dinonaktifkan sementara dari katalog publik.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-5 p-3.5 rounded-xl bg-manhwa-surface border border-manhwa-border/80 flex items-start gap-2.5 text-xs md:text-sm text-manhwa-muted">
          <Info className="w-4 h-4 text-manhwa-secondary flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Data di halaman ini adalah komik dan karakter yang sedang dinonaktifkan dari katalog publik. Anda dapat menekan tombol <strong className="text-emerald-800">Pulihkan</strong> untuk mengembalikannya ke katalog publik, atau <strong className="text-rose-800">Hapus Permanen</strong> untuk menghapusnya selamanya dari database.
          </p>
        </div>

        {/* Notifikasi Alert */}
        {alertMsg.text && (
          <div
            className={`mt-4 p-3.5 rounded-xl text-xs md:text-sm flex items-center gap-2 border animate-fadeIn ${
              alertMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {alertMsg.type === 'success' ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{alertMsg.text}</span>
          </div>
        )}

        {/* Tab Navigasi Sampah */}
        <div className="flex border-b border-manhwa-border mt-6">
          <button
            onClick={() => setActiveTab('comics')}
            className={`flex items-center gap-2 py-3 px-5 text-sm font-semibold border-b-2 transition-smooth cursor-pointer ${
              activeTab === 'comics'
                ? 'border-manhwa-accent text-manhwa-accent'
                : 'border-transparent text-manhwa-muted hover:text-manhwa-text'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Komik Terhapus ({trashedComics.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('characters')}
            className={`flex items-center gap-2 py-3 px-5 text-sm font-semibold border-b-2 transition-smooth cursor-pointer ${
              activeTab === 'characters'
                ? 'border-manhwa-accent text-manhwa-accent'
                : 'border-transparent text-manhwa-muted hover:text-manhwa-text'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Karakter Terhapus ({trashedCharacters.length})</span>
          </button>
        </div>
      </section>

      {/* Konten Tab: Komik Terhapus */}
      {activeTab === 'comics' && (
        <section className="bg-manhwa-card rounded-2xl border border-manhwa-border p-5 md:p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-manhwa-border/70">
            <h3 className="font-serif font-bold text-base md:text-lg text-manhwa-text">
              Daftar Komik di Kotak Sampah
            </h3>
            <span className="text-xs md:text-sm text-manhwa-muted font-medium">
              {trashedComics.length} Judul
            </span>
          </div>

          {trashedComics.length === 0 ? (
            <EmptyState
              title="Kotak Sampah Komik Kosong"
              description="Tidak ada komik yang sedang dihapus sementara. Semua komik saat ini aktif di katalog utama."
            />
          ) : (
            <div className="divide-y divide-manhwa-border/60">
              {trashedComics.map((comic) => (
                <div
                  key={comic.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={comic.cover_url || defaultCover}
                      alt={comic.title}
                      className="w-12 h-16 object-cover rounded-lg bg-manhwa-surface flex-shrink-0 border border-manhwa-border shadow-xs opacity-75"
                    />
                    <div className="min-w-0">
                      <h4 className="font-serif font-bold text-base text-manhwa-text truncate">
                        {comic.title}
                      </h4>
                      <p className="text-xs md:text-sm text-manhwa-muted mt-0.5">
                        {comic.author} • {comic.status} • {comic.total_chapters} Chapter
                      </p>
                      {comic.deleted_at && (
                        <span className="inline-block mt-1 text-[11px] text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          Dihapus: {new Date(comic.deleted_at).toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                    {/* Tombol Pulihkan */}
                    <button
                      onClick={() =>
                        setRestoreConfirm({
                          isOpen: true,
                          type: 'comic',
                          id: comic.id,
                          title: comic.title
                        })
                      }
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-smooth cursor-pointer"
                      title="Pulihkan ke Katalog"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Pulihkan</span>
                    </button>

                    {/* Tombol Hapus Permanen */}
                    <button
                      onClick={() =>
                        setHardDeleteConfirm({
                          isOpen: true,
                          type: 'comic',
                          id: comic.id,
                          title: comic.title
                        })
                      }
                      className="px-3.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-smooth cursor-pointer"
                      title="Hapus Permanen dari Database"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Permanen</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Konten Tab: Karakter Terhapus */}
      {activeTab === 'characters' && (
        <section className="bg-manhwa-card rounded-2xl border border-manhwa-border p-5 md:p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-manhwa-border/70">
            <h3 className="font-serif font-bold text-base md:text-lg text-manhwa-text">
              Daftar Karakter di Kotak Sampah
            </h3>
            <span className="text-xs md:text-sm text-manhwa-muted font-medium">
              {trashedCharacters.length} Karakter
            </span>
          </div>

          {trashedCharacters.length === 0 ? (
            <EmptyState
              title="Kotak Sampah Karakter Kosong"
              description="Tidak ada karakter yang sedang dihapus sementara."
            />
          ) : (
            <div className="divide-y divide-manhwa-border/60">
              {trashedCharacters.map((char) => (
                <div
                  key={char.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={char.image_url || defaultPhoto}
                      alt={char.name}
                      className="w-12 h-14 object-cover rounded-lg bg-manhwa-surface flex-shrink-0 border border-manhwa-border shadow-xs opacity-75"
                    />
                    <div className="min-w-0">
                      <h4 className="font-serif font-bold text-base text-manhwa-text truncate">
                        {char.name}
                      </h4>
                      <p className="text-xs md:text-sm text-manhwa-muted mt-0.5">
                        <strong className="text-manhwa-accent">{char.role}</strong> • Asal:{' '}
                        {char.comic_title || 'Tidak ada'}
                      </p>
                      {char.deleted_at && (
                        <span className="inline-block mt-1 text-[11px] text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          Dihapus: {new Date(char.deleted_at).toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                    {/* Tombol Pulihkan */}
                    <button
                      onClick={() =>
                        setRestoreConfirm({
                          isOpen: true,
                          type: 'character',
                          id: char.id,
                          title: char.name
                        })
                      }
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-smooth cursor-pointer"
                      title="Pulihkan Karakter"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Pulihkan</span>
                    </button>

                    {/* Tombol Hapus Permanen */}
                    <button
                      onClick={() =>
                        setHardDeleteConfirm({
                          isOpen: true,
                          type: 'character',
                          id: char.id,
                          title: char.name
                        })
                      }
                      className="px-3.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-smooth cursor-pointer"
                      title="Hapus Permanen Karakter"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Permanen</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ================= MODAL RESTORE CONFIRMATION ================= */}
      <Modal
        isOpen={restoreConfirm.isOpen}
        onClose={() => setRestoreConfirm({ isOpen: false, type: '', id: null, title: '' })}
        title="Konfirmasi Pemulihan Data"
      >
        <div className="space-y-4">
          <p className="text-sm text-manhwa-muted leading-relaxed">
            Apakah Anda yakin ingin memulihkan {restoreConfirm.type === 'comic' ? 'komik' : 'karakter'}{' '}
            <strong className="text-manhwa-text font-serif font-bold">"{restoreConfirm.title}"</strong> kembali ke katalog utama? Item ini akan langsung dapat dilihat kembali oleh para pembaca.
          </p>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setRestoreConfirm({ isOpen: false, type: '', id: null, title: '' })}
              className="px-4 py-2.5 text-sm font-semibold rounded-lg bg-manhwa-surface text-manhwa-text hover:bg-manhwa-highlight border border-manhwa-border transition-smooth cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleExecuteRestore}
              disabled={submitting}
              className="px-4 py-2.5 text-sm font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-smooth disabled:opacity-60 cursor-pointer shadow-xs"
            >
              {submitting ? 'Memulihkan...' : 'Ya, Pulihkan'}
            </button>
          </div>
        </div>
      </Modal>

      {/* ================= MODAL HARD DELETE CONFIRMATION ================= */}
      <Modal
        isOpen={hardDeleteConfirm.isOpen}
        onClose={() => setHardDeleteConfirm({ isOpen: false, type: '', id: null, title: '' })}
        title="Peringatan: Hapus Permanen"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs md:text-sm flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-700" />
            <p className="leading-relaxed">
              Data ini akan dihapus <strong>secara permanen</strong> dari database dan <strong>tidak dapat dipulihkan kembali</strong>.
            </p>
          </div>

          <p className="text-sm text-manhwa-muted leading-relaxed">
            Apakah Anda benar-benar yakin ingin menghapus {hardDeleteConfirm.type === 'comic' ? 'komik' : 'karakter'}{' '}
            <strong className="text-manhwa-text font-serif font-bold">"{hardDeleteConfirm.title}"</strong> secara permanen?
          </p>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setHardDeleteConfirm({ isOpen: false, type: '', id: null, title: '' })}
              className="px-4 py-2.5 text-sm font-semibold rounded-lg bg-manhwa-surface text-manhwa-text hover:bg-manhwa-highlight border border-manhwa-border transition-smooth cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleExecuteHardDelete}
              disabled={submitting}
              className="px-4 py-2.5 text-sm font-semibold rounded-lg bg-rose-700 text-white hover:bg-rose-800 transition-smooth disabled:opacity-60 cursor-pointer shadow-xs"
            >
              {submitting ? 'Menghapus Permanen...' : 'Ya, Hapus Permanen'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
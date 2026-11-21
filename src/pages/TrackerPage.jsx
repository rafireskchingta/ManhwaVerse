import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookmarkCheck, BookOpen, CheckCircle, Clock, Trash2, Plus, LogIn, AlertCircle } from 'lucide-react';
import { trackerService } from '../services/trackerService';
import { TrackerCard } from '../components/TrackerCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { useAuth } from '../hooks/useAuth';

export const TrackerPage = () => {
  const { user, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState('Sedang Dibaca'); // 'Sedang Dibaca' or 'Selesai Dibaca'
  const [trackerItems, setTrackerItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, reading: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal Update Progress State
  const [editingItem, setEditingItem] = useState(null);
  const [newChapter, setNewChapter] = useState(0);
  const [newStatus, setNewStatus] = useState('Sedang Dibaca');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chapterError, setChapterError] = useState(null);

  // Modal Delete Confirmation State
  const [deletingId, setDeletingId] = useState(null);
  const [deletingTitle, setDeletingTitle] = useState('');
  const [actionFeedback, setActionFeedback] = useState(null);

  const showFeedback = (type, message) => {
    setActionFeedback({ type, message });
    setTimeout(() => {
      setActionFeedback(null);
    }, 4000);
  };

  const fetchTrackerData = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [items, statsData] = await Promise.all([
        trackerService.getUserTracker(),
        trackerService.getStats()
      ]);

      setTrackerItems(items);
      setStats(statsData);
    } catch (err) {
      console.error('Error saat memuat tracker:', err);
      setError('Gagal memuat daftar bacaan Anda.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackerData();
  }, [isAuthenticated]);

  // Handle Quick +1 or direct progress update
  const handleUpdateProgressDirect = async (id, payload) => {
    try {
      await trackerService.updateProgress(id, payload);
      await fetchTrackerData();
    } catch (err) {
      showFeedback('error', err.message || 'Gagal memperbarui progres.');
    }
  };

  // Open modal edit
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setNewChapter(item.current_chapter || 0);
    setNewStatus(item.reading_status || 'Sedang Dibaca');
    setChapterError(null);
  };

  const handleChapterChange = (valStr) => {
    setNewChapter(valStr);
    if (valStr === '') {
      setChapterError('Nomor chapter wajib diisi.');
      return;
    }
    const val = parseInt(valStr, 10);
    const maxCh = editingItem?.comic?.total_chapters;
    if (isNaN(val) || val < 0) {
      setChapterError('Nomor chapter tidak boleh kurang dari 0.');
    } else if (maxCh > 0 && val > maxCh) {
      setChapterError(`Nomor chapter tidak boleh melebihi total chapter komik (${maxCh} Ch).`);
    } else {
      setChapterError(null);
    }
  };

  // Submit modal edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    if (newChapter === '') {
      setChapterError('Nomor chapter wajib diisi.');
      return;
    }

    const val = parseInt(newChapter, 10);
    const maxCh = editingItem?.comic?.total_chapters;
    if (isNaN(val) || val < 0) {
      setChapterError('Nomor chapter tidak boleh kurang dari 0.');
      return;
    }

    if (maxCh > 0 && val > maxCh) {
      setChapterError(`Nomor chapter tidak boleh melebihi total chapter komik (${maxCh} Ch).`);
      return;
    }

    setChapterError(null);

    try {
      setIsSubmitting(true);
      await trackerService.updateProgress(editingItem.id, {
        current_chapter: val,
        reading_status: newStatus
      });
      setEditingItem(null);
      await fetchTrackerData();
      showFeedback('success', 'Progres bacaan berhasil diperbarui.');
    } catch (err) {
      showFeedback('error', err.message || 'Gagal menyimpan pembaruan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deletingId) return;

    try {
      setIsSubmitting(true);
      await trackerService.deleteFromTracker(deletingId);
      setDeletingId(null);
      await fetchTrackerData();
      showFeedback('success', 'Komik berhasil dihapus dari daftar bacaan.');
    } catch (err) {
      showFeedback('error', err.message || 'Gagal menghapus dari daftar bacaan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter items by active tab
  const displayedItems = trackerItems.filter(
    (item) => item.reading_status === activeTab
  );

  // Jika belum login, tampilkan instruksi masuk
  if (!isAuthenticated) {
    return (
      <div className="py-8">
        <div className="bg-manhwa-card rounded-2xl border border-manhwa-border p-6 md:p-8 max-w-md mx-auto text-center shadow-soft">
          <div className="w-14 h-14 rounded-2xl bg-manhwa-surface text-manhwa-accent flex items-center justify-center mx-auto mb-4 border border-manhwa-border">
            <BookmarkCheck className="w-7 h-7" />
          </div>
          <h2 className="font-serif font-bold text-lg md:text-xl text-manhwa-text">
            Pelacak Progres Bacaan Pribadi
          </h2>
          <p className="text-xs md:text-sm text-manhwa-muted mt-2 leading-relaxed">
            Masuk ke akun ManhwaVerse Anda untuk mencatat chapter komik yang sedang Anda ikuti, menandai komik yang telah tamat, dan melihat statistik bacaan.
          </p>

          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              to="/login"
              className="w-full py-2.5 px-4 rounded-xl bg-manhwa-accent text-white font-semibold text-xs md:text-sm hover:bg-manhwa-accent-hover transition-smooth flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk ke Akun</span>
            </Link>
            <Link
              to="/register"
              className="w-full py-2.5 px-4 rounded-xl bg-manhwa-surface text-manhwa-text font-semibold text-xs md:text-sm hover:bg-manhwa-highlight border border-manhwa-border transition-smooth"
            >
              Daftar Akun Baru
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert Notifikasi Aksi */}
      {actionFeedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs md:text-sm flex items-center justify-between transition-smooth ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <span>{actionFeedback.message}</span>
          <button
            onClick={() => setActionFeedback(null)}
            className="text-xs font-semibold underline ml-3 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Header & Statistik Sederhana */}
      <section className="bg-manhwa-card rounded-2xl border border-manhwa-border p-5 md:p-7 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs md:text-sm font-semibold tracking-wider uppercase text-manhwa-secondary">
              Aktivitas Membaca
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-serif text-manhwa-text mt-1.5 leading-tight">
              Bacaan Saya
            </h2>
            <p className="text-sm md:text-base text-manhwa-muted mt-1 leading-relaxed">
              Kelola progres setiap chapter dan catat perjalanan membacamu.
            </p>
          </div>
        </div>

        {/* 3 Statistik Sederhana */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mt-5">
          <div className="bg-manhwa-surface rounded-xl p-3.5 border border-manhwa-border/80 flex flex-col">
            <div className="flex items-center gap-1.5 text-manhwa-muted text-xs md:text-sm font-medium">
              <BookOpen className="w-4 h-4 text-manhwa-text" />
              <span>Total Komik</span>
            </div>
            <span className="font-serif font-bold text-xl md:text-3xl text-manhwa-text mt-1.5">
              {stats.total}
            </span>
          </div>

          <div className="bg-amber-50/60 rounded-xl p-3.5 border border-amber-200/60 flex flex-col">
            <div className="flex items-center gap-1.5 text-amber-800 text-xs md:text-sm font-medium">
              <Clock className="w-4 h-4" />
              <span>Sedang Baca</span>
            </div>
            <span className="font-serif font-bold text-xl md:text-3xl text-amber-900 mt-1.5">
              {stats.reading}
            </span>
          </div>

          <div className="bg-emerald-50/60 rounded-xl p-3.5 border border-emerald-200/60 flex flex-col">
            <div className="flex items-center gap-1.5 text-emerald-800 text-xs md:text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>Selesai</span>
            </div>
            <span className="font-serif font-bold text-xl md:text-3xl text-emerald-900 mt-1.5">
              {stats.completed}
            </span>
          </div>
        </div>

        {/* Tab Navigasi Kategori (Sedang Dibaca / Selesai Dibaca) */}
        <div className="flex border-b border-manhwa-border mt-6">
          <button
            onClick={() => setActiveTab('Sedang Dibaca')}
            className={`flex items-center gap-2 py-3 px-5 text-sm font-semibold border-b-2 transition-smooth cursor-pointer ${
              activeTab === 'Sedang Dibaca'
                ? 'border-manhwa-accent text-manhwa-accent'
                : 'border-transparent text-manhwa-muted hover:text-manhwa-text'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Sedang Dibaca ({stats.reading})</span>
          </button>

          <button
            onClick={() => setActiveTab('Selesai Dibaca')}
            className={`flex items-center gap-2 py-3 px-5 text-sm font-semibold border-b-2 transition-smooth cursor-pointer ${
              activeTab === 'Selesai Dibaca'
                ? 'border-manhwa-accent text-manhwa-accent'
                : 'border-transparent text-manhwa-muted hover:text-manhwa-text'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Selesai Dibaca ({stats.completed})</span>
          </button>
        </div>
      </section>

      {/* Konten Daftar Bacaan */}
      <section>
        {loading ? (
          <LoadingSpinner message="Mengambil daftar bacaan Anda..." />
        ) : error ? (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {error}
          </div>
        ) : displayedItems.length === 0 ? (
          <EmptyState
            icon={BookmarkCheck}
            title={`Belum Ada Komik ${activeTab}`}
            description={
              activeTab === 'Sedang Dibaca'
                ? 'Anda belum menandai komik yang sedang dibaca. Telusuri katalog dan klik "Tambahkan ke Bacaan Saya".'
                : 'Belum ada komik yang selesai Anda baca.'
            }
            actionLabel="Jelajahi Katalog Komik"
            onAction={() => (window.location.href = '/')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4 md:gap-5">
            {displayedItems.map((item) => (
              <TrackerCard
                key={item.id}
                item={item}
                onUpdateProgress={
                  // Jika dipanggil dari tombol edit, buka modal, jika objek payload langsung dieksekusi
                  (idOrItem, payload) => {
                    if (payload) {
                      handleUpdateProgressDirect(idOrItem, payload);
                    } else {
                      handleOpenEdit(idOrItem);
                    }
                  }
                }
                onDelete={(id, title) => {
                  setDeletingId(id);
                  setDeletingTitle(title);
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modal Edit Progres Bacaan */}
      <Modal
        isOpen={Boolean(editingItem)}
        onClose={() => {
          setEditingItem(null);
          setChapterError(null);
        }}
        title="Perbarui Progres Bacaan"
      >
        {editingItem && (
          <form onSubmit={handleSaveEdit} noValidate className="space-y-4">
            <div>
              <p className="text-xs text-manhwa-muted font-medium mb-1">Judul Komik</p>
              <p className="font-serif font-bold text-sm text-manhwa-text">
                {editingItem.comic?.title}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-manhwa-text mb-1">
                Chapter Terakhir Dibaca
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={newChapter}
                  onChange={(e) => handleChapterChange(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl bg-manhwa-surface border text-xs md:text-sm focus:outline-none font-serif transition-smooth ${
                    chapterError
                      ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20'
                      : 'border-manhwa-border focus:border-manhwa-accent'
                  }`}
                  placeholder="0"
                  required
                />
                {editingItem.comic?.total_chapters > 0 && (
                  <span className="text-xs text-manhwa-muted whitespace-nowrap">
                    / {editingItem.comic.total_chapters} Ch
                  </span>
                )}
              </div>

              {/* Custom Validation Message */}
              {chapterError && (
                <div className="mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200/90 text-rose-800 text-xs flex items-start gap-2 shadow-xs animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{chapterError}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-manhwa-text mb-1">
                Status Bacaan
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-manhwa-surface border border-manhwa-border text-xs md:text-sm focus:outline-none focus:border-manhwa-accent"
              >
                <option value="Sedang Dibaca">Sedang Dibaca</option>
                <option value="Selesai Dibaca">Selesai Dibaca</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setChapterError(null);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-manhwa-surface text-manhwa-text hover:bg-manhwa-highlight border border-manhwa-border transition-smooth cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting || Boolean(chapterError)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-manhwa-accent text-white hover:bg-manhwa-accent-hover transition-smooth disabled:opacity-60 cursor-pointer shadow-xs"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal Hapus Bacaan */}
      <Modal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        title="Hapus dari Bacaan?"
      >
        <div className="space-y-4">
          <p className="text-xs text-manhwa-muted leading-relaxed">
            Apakah Anda yakin ingin menghapus komik <strong className="text-manhwa-text font-serif">"{deletingTitle}"</strong> dari daftar bacaan Anda? Progres chapter yang tersimpan akan dihapus.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDeletingId(null)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-manhwa-surface text-manhwa-text hover:bg-manhwa-highlight border border-manhwa-border transition-smooth"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-700 text-white hover:bg-rose-800 transition-smooth disabled:opacity-60"
            >
              {isSubmitting ? 'Menghapus...' : 'Hapus Komik'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

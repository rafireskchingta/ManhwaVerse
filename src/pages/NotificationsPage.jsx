import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Sparkles,
  Layers,
  Newspaper,
  CheckCheck,
  Plus,
  Clock,
  ChevronRight,
  WifiOff,
  Trash2,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { notificationService, NOTIFICATIONS_EVENT } from '../services/notificationService';
import { comicService } from '../services/comicService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { useAuth } from '../hooks/useAuth';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const TYPE_META = {
  new_comic: {
    label: 'Manhwa Baru',
    icon: Sparkles,
    badgeClass: 'bg-emerald-900/10 text-emerald-800 border-emerald-900/20',
    iconBgClass: 'bg-emerald-900/10 text-emerald-700'
  },
  chapter_update: {
    label: 'Update Chapter',
    icon: Layers,
    badgeClass: 'bg-amber-900/10 text-amber-800 border-amber-900/20',
    iconBgClass: 'bg-amber-900/10 text-amber-700'
  },
  news: {
    label: 'Berita Terbaru',
    icon: Newspaper,
    badgeClass: 'bg-manhwa-accent/10 text-manhwa-accent border-manhwa-accent/25',
    iconBgClass: 'bg-manhwa-accent/10 text-manhwa-accent'
  }
};

const FILTER_TABS = [
  { key: 'all', label: 'Semua' },
  { key: 'new_comic', label: 'Manhwa Baru' },
  { key: 'chapter_update', label: 'Update Chapter' },
  { key: 'news', label: 'Berita Terbaru' }
];

const formatNotificationTime = (dateStr) => {
  if (!dateStr) return 'Baru saja';
  const time = new Date(dateStr).getTime();
  if (Number.isNaN(time)) return 'Baru saja';

  const diffSec = Math.max(0, Math.floor((Date.now() - time) / 1000));
  if (diffSec < 60) return 'Baru saja';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} menit lalu`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} jam lalu`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)} hari lalu`;

  return new Date(time).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const isOnline = useOnlineStatus();

  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(() => notificationService.getReadIds());
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal Tambah Berita / Notifikasi (Khusus Admin)
  const [comicsList, setComicsList] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formState, setFormState] = useState({
    type: 'news',
    comic_id: '',
    title: '',
    message: '',
    link_url: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getAll();
      setNotifications(data);
      setReadIds(notificationService.getReadIds());
      if (isAdmin && isOnline && comicsList.length === 0) {
        comicService.getAll({ limit: 50 }).then(setComicsList).catch(() => {});
      }
    } catch (err) {
      console.error('Error saat memuat notifikasi:', err);
      setError(
        isOnline
          ? 'Gagal memuat daftar notifikasi dari server.'
          : 'Anda sedang offline dan notifikasi belum pernah tersimpan di cache perangkat.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [isOnline]);

  useEffect(() => {
    const syncRead = () => setReadIds(notificationService.getReadIds());
    window.addEventListener(NOTIFICATIONS_EVENT, syncRead);
    return () => window.removeEventListener(NOTIFICATIONS_EVENT, syncRead);
  }, []);

  const filteredNotifications =
    activeTab === 'all'
      ? notifications
      : notifications.filter((item) => item.type === activeTab);

  const unreadCount = notifications.filter((item) => !readIds.has(item.id)).length;

  const getTabCount = (tabKey) =>
    tabKey === 'all'
      ? notifications.length
      : notifications.filter((item) => item.type === tabKey).length;

  const handleOpenNotification = (item) => {
    notificationService.markAsRead(item.id);
    setReadIds(notificationService.getReadIds());

    if (item.comic_id) {
      navigate(`/comics/${item.comic_id}`);
      return;
    }

    if (item.link_url) {
      if (item.link_url.startsWith('http')) {
        window.open(item.link_url, '_blank', 'noopener,noreferrer');
      } else {
        navigate(item.link_url);
      }
    }
  };

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead(notifications.map((n) => n.id));
    setReadIds(notificationService.getReadIds());
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formState.title.trim() || !formState.message.trim()) {
      setFormError('Judul dan isi pesan notifikasi wajib diisi.');
      return;
    }

    try {
      setSubmitting(true);
      await notificationService.create({
        type: formState.type,
        comic_id: formState.comic_id || null,
        title: formState.title.trim(),
        message: formState.message.trim(),
        link_url: formState.link_url.trim() || null
      });
      setIsAddModalOpen(false);
      setFormState({ type: 'news', comic_id: '', title: '', message: '', link_url: '' });
      await fetchNotifications();
    } catch (err) {
      setFormError(err.message || 'Gagal menerbitkan notifikasi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCustom = async (e, id) => {
    e.stopPropagation();
    try {
      await notificationService.remove(id);
      await fetchNotifications();
    } catch (err) {
      console.warn('Tidak bisa menghapus notifikasi:', err.message);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      {/* Banner Mode Offline */}
      {!isOnline && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-900 text-xs font-medium">
          <WifiOff className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span>
            Mode Offline: Menampilkan {notifications.length} notifikasi yang tersimpan di perangkat.
          </span>
        </div>
      )}

      {/* Header Halaman Notifikasi */}
      <section className="bg-manhwa-card rounded-2xl border border-manhwa-border p-5 md:p-7 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-manhwa-accent/10 text-manhwa-accent flex items-center justify-center border border-manhwa-accent/20 flex-shrink-0">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl md:text-3xl font-bold font-serif text-manhwa-text">
                  Notifikasi & Kabar Terbaru
                </h2>
                {unreadCount > 0 && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                    {unreadCount} Belum Dibaca
                  </span>
                )}
              </div>
              <p className="text-sm text-manhwa-muted mt-1 leading-relaxed">
                Info manhwa baru, update chapter terbaru, dan berita seputar ManhwaVerse semuanya masuk di sini.
              </p>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-manhwa-surface text-manhwa-text hover:bg-manhwa-highlight border border-manhwa-border text-xs font-semibold transition-smooth cursor-pointer"
              >
                <CheckCheck className="w-4 h-4 text-manhwa-accent" />
                <span>Tandai Semua Dibaca</span>
              </button>
            )}

            {isAdmin && isOnline && (
              <button
                type="button"
                onClick={() => {
                  setFormError('');
                  setIsAddModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-manhwa-accent text-white hover:bg-manhwa-accent-hover text-xs font-semibold transition-smooth shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Berita</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Kategori Notifikasi */}
        <div className="mt-5 pt-4 border-t border-manhwa-border/60 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const count = getTabCount(tab.key);
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-1.5 text-xs md:text-sm px-3.5 py-1.5 rounded-full border transition-smooth flex-shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-manhwa-accent text-white border-manhwa-accent font-semibold shadow-xs'
                    : 'bg-manhwa-surface text-manhwa-muted border-manhwa-border hover:text-manhwa-text'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-manhwa-card text-manhwa-muted border border-manhwa-border/70'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Daftar Notifikasi */}
      {loading ? (
        <LoadingSpinner message="Memuat notifikasi terbaru..." />
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {error}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Belum Ada Notifikasi"
          description="Belum ada notifikasi pada kategori ini. Pantau terus pembaruan manhwa dan berita terbaru di sini."
          actionLabel={activeTab !== 'all' ? 'Tampilkan Semua' : undefined}
          onAction={activeTab !== 'all' ? () => setActiveTab('all') : undefined}
        />
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((item) => {
            const meta = TYPE_META[item.type] || TYPE_META.news;
            const CategoryIcon = meta.icon;
            const isUnread = !readIds.has(item.id);
            const isCustomNews =
              item.type === 'news' ||
              (!item.id.startsWith('new-comic-') && !item.id.startsWith('chapter-update-'));

            return (
              <div
                key={item.id}
                onClick={() => handleOpenNotification(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenNotification(item);
                  }
                }}
                className={`group rounded-2xl border p-4 md:p-5 transition-smooth shadow-soft hover:shadow-elevated flex gap-3.5 md:gap-4 items-start cursor-pointer ${
                  isUnread
                    ? 'bg-manhwa-card border-manhwa-accent/40 ring-1 ring-manhwa-accent/10'
                    : 'bg-manhwa-card/75 border-manhwa-border hover:bg-manhwa-card'
                }`}
              >
                {/* Cover Komik atau Ikon Kategori */}
                {item.cover_url ? (
                  <div className="w-14 sm:w-16 aspect-[3/4] rounded-xl overflow-hidden bg-manhwa-surface border border-manhwa-border flex-shrink-0">
                    <img
                      src={item.cover_url}
                      alt={item.comic_title || item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                    />
                  </div>
                ) : (
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center border border-manhwa-border/60 flex-shrink-0 ${meta.iconBgClass}`}
                  >
                    <CategoryIcon className="w-6 h-6" />
                  </div>
                )}

                {/* Konten Notifikasi */}
                <div className="flex-grow min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${meta.badgeClass}`}
                      >
                        <CategoryIcon className="w-3 h-3" />
                        <span>{meta.label}</span>
                      </span>

                      {isUnread && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700">
                          <span className="w-2 h-2 rounded-full bg-rose-600 inline-block" />
                          Baru
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-manhwa-muted">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatNotificationTime(item.created_at)}</span>

                      {isAdmin && isOnline && isCustomNews && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCustom(e, item.id)}
                          className="p-1 rounded-lg text-manhwa-muted hover:text-rose-700 hover:bg-rose-50 transition-smooth"
                          title="Hapus notifikasi ini"
                          aria-label="Hapus notifikasi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-base md:text-lg text-manhwa-text group-hover:text-manhwa-accent transition-smooth leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs md:text-sm text-manhwa-muted leading-relaxed">
                    {item.message}
                  </p>

                  {(item.comic_id || item.link_url) && (
                    <div className="pt-1 inline-flex items-center gap-1 text-xs font-semibold text-manhwa-accent">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{item.comic_id ? 'Baca Sekarang • Detail Komik' : 'Buka Tautan Terkait'}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Admin: Tambah Berita / Notifikasi Baru */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Berita / Notifikasi Baru"
      >
        <form onSubmit={handleCreateNotification} noValidate className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-manhwa-text mb-1">
              Kategori Notifikasi
            </label>
            <select
              value={formState.type}
              onChange={(e) => setFormState((prev) => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 text-xs md:text-sm bg-manhwa-surface border border-manhwa-border rounded-xl text-manhwa-text focus:outline-none focus:border-manhwa-accent"
            >
              <option value="news">Berita Terbaru</option>
              <option value="new_comic">Manhwa Baru</option>
              <option value="chapter_update">Update Chapter Baru</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-manhwa-text mb-1">
              Komik Terkait (Supaya Diklik Langsung ke Detail Komik)
            </label>
            <select
              value={formState.comic_id}
              onChange={(e) => setFormState((prev) => ({ ...prev, comic_id: e.target.value }))}
              className="w-full px-3 py-2 text-xs md:text-sm bg-manhwa-surface border border-manhwa-border rounded-xl text-manhwa-text focus:outline-none focus:border-manhwa-accent"
            >
              <option value="">-- Pilih Komik (Opsional) --</option>
              {comicsList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-manhwa-text mb-1">
              Judul Notifikasi
            </label>
            <input
              type="text"
              value={formState.title}
              onChange={(e) => setFormState((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Contoh: Rilis Adaptasi Anime Solo Leveling Musim Baru"
              className="w-full px-3 py-2 text-xs md:text-sm bg-manhwa-surface border border-manhwa-border rounded-xl text-manhwa-text focus:outline-none focus:border-manhwa-accent"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-manhwa-text mb-1">
              Isi Berita / Pesan
            </label>
            <textarea
              rows="3"
              value={formState.message}
              onChange={(e) => setFormState((prev) => ({ ...prev, message: e.target.value }))}
              placeholder="Tulis informasi singkat agar mudah dibaca pengguna..."
              className="w-full px-3 py-2 text-xs md:text-sm bg-manhwa-surface border border-manhwa-border rounded-xl text-manhwa-text focus:outline-none focus:border-manhwa-accent"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-manhwa-text mb-1">
              Tautan Tujuan (Opsional)
            </label>
            <input
              type="text"
              value={formState.link_url}
              onChange={(e) => setFormState((prev) => ({ ...prev, link_url: e.target.value }))}
              placeholder="/discover atau https://..."
              className="w-full px-3 py-2 text-xs md:text-sm bg-manhwa-surface border border-manhwa-border rounded-xl text-manhwa-text focus:outline-none focus:border-manhwa-accent"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-manhwa-surface text-manhwa-muted hover:text-manhwa-text border border-manhwa-border text-xs font-semibold transition-smooth cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-manhwa-accent text-white text-xs font-semibold hover:bg-manhwa-accent-hover transition-smooth shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Memublikasikan...' : 'Publikasikan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

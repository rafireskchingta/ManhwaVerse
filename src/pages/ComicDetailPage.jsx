import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Layers,
  User,
  BookmarkCheck,
  CheckCircle,
  Clock,
  Sparkles,
  Users,
  AlertCircle
} from 'lucide-react';
import { comicService } from '../services/comicService';
import { trackerService } from '../services/trackerService';
import { CharacterCard } from '../components/CharacterCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Modal } from '../components/Modal';
import { useAuth } from '../hooks/useAuth';

export const ComicDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Tracker state for this comic
  const [trackerItem, setTrackerItem] = useState(null);
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);
  const [trackedChapter, setTrackedChapter] = useState(0);
  const [trackedStatus, setTrackedStatus] = useState('Sedang Dibaca');
  const [savingTracker, setSavingTracker] = useState(false);
  const [trackerError, setTrackerError] = useState(null);
  const [chapterError, setChapterError] = useState(null);

  useEffect(() => {
    const fetchComicDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await comicService.getById(id);
        setComic(data);

        // Jika terautentikasi, periksa apakah komik ini sudah ada di tracker pengguna
        if (isAuthenticated) {
          const tracked = await trackerService.checkComicStatus(id);
          if (tracked) {
            setTrackerItem(tracked);
            setTrackedChapter(tracked.current_chapter || 0);
            setTrackedStatus(tracked.reading_status || 'Sedang Dibaca');
          }
        }
      } catch (err) {
        console.error('Error saat memuat detail komik:', err);
        setError('Gagal memuat informasi komik.');
      } finally {
        setLoading(false);
      }
    };

    fetchComicDetail();
  }, [id, isAuthenticated]);

  const handleChapterChange = (valStr) => {
    setTrackedChapter(valStr);
    if (valStr === '') {
      setChapterError('Nomor chapter wajib diisi.');
      return;
    }
    const val = parseInt(valStr, 10);
    if (isNaN(val) || val < 0) {
      setChapterError('Nomor chapter tidak boleh kurang dari 0.');
    } else if (comic?.total_chapters > 0 && val > comic.total_chapters) {
      setChapterError(`Nomor chapter tidak boleh melebihi total chapter komik (${comic.total_chapters} Ch).`);
    } else {
      setChapterError(null);
    }
  };

  const handleSaveTracker = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (trackedChapter === '') {
      setChapterError('Nomor chapter wajib diisi.');
      return;
    }

    const val = parseInt(trackedChapter, 10);
    if (isNaN(val) || val < 0) {
      setChapterError('Nomor chapter tidak boleh kurang dari 0.');
      return;
    }

    if (comic?.total_chapters > 0 && val > comic.total_chapters) {
      setChapterError(`Nomor chapter tidak boleh melebihi total chapter komik (${comic.total_chapters} Ch).`);
      return;
    }

    setChapterError(null);

    try {
      setSavingTracker(true);
      setTrackerError(null);
      const res = await trackerService.addToTracker({
        comic_id: id,
        reading_status: trackedStatus,
        current_chapter: val
      });
      setTrackerItem(res);
      setIsTrackerModalOpen(false);
    } catch (err) {
      setTrackerError(err.message || 'Gagal menyimpan ke daftar bacaan.');
    } finally {
      setSavingTracker(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Menyiapkan detail komik..." />;
  }

  if (error || !comic) {
    return (
      <div className="py-12 text-center max-w-md mx-auto">
        <p className="text-sm text-rose-800 bg-rose-50 p-4 rounded-xl border border-rose-200">
          {error || 'Komik tidak ditemukan.'}
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-manhwa-surface text-manhwa-text hover:bg-manhwa-highlight border border-manhwa-border transition-smooth"
        >
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  const defaultCover =
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';

  const isCompleted = comic.status === 'Completed';

  return (
    <div className="space-y-6">
      {/* Tombol Kembali */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-manhwa-muted hover:text-manhwa-text transition-smooth py-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali</span>
      </button>

      {/* Main Comic Hero Section */}
      <section className="bg-manhwa-card rounded-2xl border border-manhwa-border p-5 md:p-6 shadow-soft">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Cover Image */}
          <div className="w-full sm:w-64 md:w-72 lg:w-80 aspect-[3/4] rounded-xl overflow-hidden bg-manhwa-surface border border-manhwa-border flex-shrink-0 relative shadow-soft">
            <img
              src={!imageError && comic.cover_url ? comic.cover_url : defaultCover}
              alt={comic.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
            {/* Status Pill */}
            <div className="absolute top-2.5 right-2.5">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full border shadow-xs ${
                  isCompleted
                    ? 'bg-emerald-800 text-emerald-50 border-emerald-700'
                    : 'bg-manhwa-card/95 text-manhwa-accent border-manhwa-border'
                }`}
              >
                {isCompleted ? 'Tamat' : 'Ongoing'}
              </span>
            </div>
          </div>

          {/* Details & Metadata */}
          <div className="flex flex-col justify-between flex-grow">
            <div>
              {/* Genre Pills */}
              <div className="flex flex-wrap gap-2 mb-2.5">
                {comic.genres && comic.genres.map((g) => (
                  <Link
                    key={g.id || g.name}
                    to={`/discover`}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-manhwa-surface text-manhwa-muted border border-manhwa-border hover:text-manhwa-text transition-smooth"
                  >
                    {g.name}
                  </Link>
                ))}
              </div>

              {/* Title & Alternative Title */}
              <h1 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-manhwa-text leading-tight">
                {comic.title}
              </h1>
              {comic.alternative_title && (
                <p className="text-sm md:text-base text-manhwa-muted italic mt-1">
                  "{comic.alternative_title}"
                </p>
              )}

              {/* Author & Chapter Info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mt-5 py-3.5 border-y border-manhwa-border/70 text-sm">
                <div>
                  <span className="text-xs text-manhwa-muted uppercase font-medium block">
                    Penulis / Author
                  </span>
                  <span className="font-semibold text-sm md:text-base text-manhwa-text mt-0.5 block">
                    {comic.author || 'Tidak diketahui'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-manhwa-muted uppercase font-medium block">
                    Total Chapter
                  </span>
                  <span className="font-semibold text-sm md:text-base text-manhwa-text mt-0.5 block">
                    {comic.total_chapters > 0 ? `${comic.total_chapters} Chapter` : 'Belum Ditentukan'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-manhwa-muted uppercase font-medium block">
                    Status Rilis
                  </span>
                  <span className="font-semibold text-sm md:text-base text-manhwa-text mt-0.5 block">
                    {comic.status}
                  </span>
                </div>
              </div>

              {/* Synopsis */}
              <div className="mt-5">
                <h3 className="font-serif font-bold text-base md:text-lg text-manhwa-text mb-1.5">
                  Sinopsis
                </h3>
                <p className="text-sm md:text-base text-manhwa-muted leading-relaxed whitespace-pre-line">
                  {comic.synopsis || 'Sinopsis belum tersedia untuk judul ini.'}
                </p>
              </div>
            </div>

            {/* Reading Tracker Action Button */}
            <div className="mt-6 pt-4 border-t border-manhwa-border/60">
              {trackerItem ? (
                <div className="bg-manhwa-surface p-4 rounded-xl border border-manhwa-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-manhwa-text">
                        Ada di Bacaan Saya ({trackerItem.reading_status})
                      </p>
                      <p className="text-xs md:text-sm text-manhwa-muted mt-0.5">
                        Progres saat ini: Chapter {trackerItem.current_chapter}
                        {comic.total_chapters > 0 && ` dari ${comic.total_chapters}`}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsTrackerModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-manhwa-accent text-white font-semibold text-sm hover:bg-manhwa-accent-hover transition-smooth shadow-xs whitespace-nowrap cursor-pointer"
                  >
                    Ubah Progres
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/login');
                    } else {
                      setIsTrackerModalOpen(true);
                    }
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-manhwa-accent text-white font-semibold text-xs md:text-sm hover:bg-manhwa-accent-hover transition-smooth shadow-soft flex items-center justify-center gap-2"
                >
                  <BookmarkCheck className="w-4 h-4" />
                  <span>Tambahkan ke Bacaan Saya</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Daftar Karakter dari Komik Ini */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-manhwa-secondary" />
            <h3 className="font-serif font-bold text-base md:text-lg text-manhwa-text">
              Karakter Utama ({comic.characters?.length || 0})
            </h3>
          </div>
        </div>

        {comic.characters && comic.characters.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 md:gap-4">
            {comic.characters.map((char) => (
              <CharacterCard
                key={char.id}
                character={{ ...char, comic_title: comic.title }}
              />
            ))}
          </div>
        ) : (
          <div className="p-5 text-center bg-manhwa-card rounded-xl border border-manhwa-border/80 text-xs text-manhwa-muted">
            Belum ada karakter yang dicatat untuk komik ini.
          </div>
        )}
      </section>

      {/* Modal Tambahkan / Ubah Tracker */}
      <Modal
        isOpen={isTrackerModalOpen}
        onClose={() => {
          setIsTrackerModalOpen(false);
          setTrackerError(null);
          setChapterError(null);
        }}
        title={trackerItem ? 'Ubah Progres Bacaan' : 'Tambahkan ke Bacaan Saya'}
      >
        <form onSubmit={handleSaveTracker} noValidate className="space-y-4">
          {trackerError && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{trackerError}</span>
            </div>
          )}
          <div>
            <p className="text-xs text-manhwa-muted font-medium mb-0.5">Komik</p>
            <p className="font-serif font-bold text-sm text-manhwa-text">
              {comic.title}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-manhwa-text mb-1">
              Chapter Terakhir yang Dibaca
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={trackedChapter}
                onChange={(e) => handleChapterChange(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl bg-manhwa-surface border text-xs md:text-sm focus:outline-none font-serif transition-smooth ${
                  chapterError
                    ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20'
                    : 'border-manhwa-border focus:border-manhwa-accent'
                }`}
                placeholder="0"
                required
              />
              {comic.total_chapters > 0 && (
                <span className="text-xs text-manhwa-muted whitespace-nowrap">
                  / {comic.total_chapters} Ch
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
              value={trackedStatus}
              onChange={(e) => setTrackedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-manhwa-surface border border-manhwa-border text-xs md:text-sm focus:outline-none focus:border-manhwa-accent"
            >
              <option value="Sedang Dibaca">Sedang Dibaca</option>
              <option value="Selesai Dibaca">Selesai Dibaca</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsTrackerModalOpen(false);
                setTrackerError(null);
                setChapterError(null);
              }}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-manhwa-surface text-manhwa-text hover:bg-manhwa-highlight border border-manhwa-border transition-smooth cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={savingTracker || Boolean(chapterError)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-manhwa-accent text-white hover:bg-manhwa-accent-hover transition-smooth disabled:opacity-60 cursor-pointer shadow-xs"
            >
              {savingTracker ? 'Menyimpan...' : 'Simpan ke Tracker'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

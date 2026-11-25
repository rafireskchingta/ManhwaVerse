import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
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
  AlertCircle,
  Share2,
  WifiOff,
  Play
} from 'lucide-react';
import { comicService } from '../services/comicService';
import { trackerService } from '../services/trackerService';
import { offlineStorage } from '../services/offlineStorage';
import { CharacterCard } from '../components/CharacterCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Modal } from '../components/Modal';
import { ShareComicModal } from '../components/ShareComicModal';
import { QuickProgressModal } from '../components/QuickProgressModal';
import { useAuth } from '../hooks/useAuth';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const ComicDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isOnline = useOnlineStatus();

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

  // Share modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Quick return detection modal state (Trik 1)
  const [showQuickReturnModal, setShowQuickReturnModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [resolvedReadLink, setResolvedReadLink] = useState(null);

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
        } else {
          // Cek di penyimpanan tracker offline jika belum login
          const localTracked = await offlineStorage.checkComicInTracker(id);
          if (localTracked) {
            setTrackerItem(localTracked);
            setTrackedChapter(localTracked.current_chapter || 0);
            setTrackedStatus(localTracked.reading_status || 'Sedang Dibaca');
          }
        }
      } catch (err) {
        console.error('Error saat memuat detail komik:', err);
        setError(
          isOnline
            ? 'Gagal memuat informasi komik. Komik mungkin telah dihapus.'
            : 'Komik ini belum tersimpan di cache offline perangkat Anda. Silakan hubungkan perangkat ke internet untuk membukanya pertama kali.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComicDetail();
  }, [id, isAuthenticated, isOnline]);

  // Listener Deteksi Kembali ke Tab Aplikasi (Trik 1: Tab Return Detection)
  useEffect(() => {
    const handleCheckReturn = () => {
      if (document.visibilityState === 'visible') {
        const raw = sessionStorage.getItem('mv_reading_session');
        if (raw) {
          try {
            const sess = JSON.parse(raw);
            if (sess.comic_id === id) {
              const elapsed = Date.now() - (sess.started_at || 0);
              // Jika user berada di luar setidaknya 2 detik
              if (elapsed > 2000) {
                setShowQuickReturnModal(true);
                sessionStorage.removeItem('mv_reading_session');
              }
            }
          } catch (e) {
            sessionStorage.removeItem('mv_reading_session');
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleCheckReturn);
    window.addEventListener('focus', handleCheckReturn);

    return () => {
      document.removeEventListener('visibilitychange', handleCheckReturn);
      window.removeEventListener('focus', handleCheckReturn);
    };
  }, [id]);

  // Pre-resolve tautan Komiku.org untuk komik & chapter saat ini (agar popup tidak diblokir browser)
  useEffect(() => {
    if (!comic || !isOnline) return;
    let cancelled = false;
    const currentCh = trackerItem?.current_chapter || 0;

    comicService.getReadLink(id, currentCh).then((linkData) => {
      if (!cancelled && linkData) {
        setResolvedReadLink(linkData);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [id, comic?.id, trackerItem?.current_chapter, isOnline]);

  // Fallback URL sinkron ke Komiku.org jika resolver belum selesai atau mode offline
  const getFallbackKomikuUrl = (comicData) => {
    if (!comicData) return 'https://komiku.org/';
    const slugMap = {
      "omniscient reader's viewpoint": 'https://komiku.org/manga/omniscient-readers-viewpoint/',
      'omniscient readers viewpoint': 'https://komiku.org/manga/omniscient-readers-viewpoint/',
      'solo leveling': 'https://komiku.org/manga/solo-leveling-id/',
      'the beginning after the end': 'https://komiku.org/manga/the-beginning-after-the-end/',
      'the world’s best engineer': 'https://komiku.org/manga/the-worlds-best-engineer/',
      "the world's best engineer": 'https://komiku.org/manga/the-worlds-best-engineer/',
      'the greatest estate developer': 'https://komiku.org/manga/the-worlds-best-engineer/',
      'return of the flowery mountain sect': 'https://komiku.org/manga/return-of-the-flowery-mountain-sect/',
      'return of the mount hua sect': 'https://komiku.org/manga/return-of-the-flowery-mountain-sect/',
      'mercenary enrollment': 'https://komiku.org/manga/mercenary-enrollment/',
      'nano machine': 'https://komiku.org/manga/nano-machine/',
      'lookism': 'https://komiku.org/manga/lookism/',
      'pick me up': 'https://komiku.org/manga/pick-me-up/',
      'sss-class suicide hunter': 'https://komiku.org/manga/sss-class-suicide-hunter/',
      'overgeared new': 'https://komiku.org/manga/overgeared-new/',
      'one piece': 'https://komiku.org/manga/komik-one-piece-indo/',
      'one punch man': 'https://komiku.org/manga/manga-one-punch-man/',
      'jujutsu kaisen': 'https://komiku.org/manga/jujutsu-kaisen-indo/',
      'blue lock': 'https://komiku.org/manga/blue-lock/',
      'kimetsu no yaiba': 'https://komiku.org/manga/kimetsu-no-yaiba-indonesia/',
      'chainsaw man': 'https://komiku.org/manga/123213-chainsaw-man/',
      'the time-limited villainess who makes medicine': 'https://komiku.org/manga/the-time-limited-villainess-who-makes-medicine/',
      'i’m a contract stepmother, but the tyrant is way too overprotective': 'https://komiku.org/manga/im-a-contract-stepmother-but-the-tyrant-is-way-too-overprotective/',
      "i'm a contract stepmother, but the tyrant is way too overprotective": 'https://komiku.org/manga/im-a-contract-stepmother-but-the-tyrant-is-way-too-overprotective/',
      'the boxer': 'https://komiku.org/manga/the-boxer/',
      'i’ll be a villain in this life': 'https://komiku.org/manga/ill-be-a-villain-in-this-life/',
      "i'll be a villain in this life": 'https://komiku.org/manga/ill-be-a-villain-in-this-life/',
      'absolute sword sense': 'https://komiku.org/manga/absolute-sword-sense/'
    };
    const key = (comicData.title || '').trim().toLowerCase();
    return (
      slugMap[key] ||
      `https://komiku.org/?post_type=manga&s=${encodeURIComponent((comicData.title || '').trim())}`
    );
  };

  // Handler saat tombol "Baca" / "Lanjutkan" ditekan
  const handleStartReading = () => {
    if (!comic) return;

    if (!isOnline) {
      setToastMessage('Anda sedang offline. Hubungkan internet untuk membaca chapter di Komiku.org.');
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    const currentCh = trackerItem?.current_chapter || 0;
    const targetUrl = resolvedReadLink?.readUrl || getFallbackKomikuUrl(comic);

    // Simpan penanda sesi bahwa pengguna sedang membaca komik ini
    try {
      sessionStorage.setItem(
        'mv_reading_session',
        JSON.stringify({
          comic_id: id,
          title: comic.title,
          last_chapter: currentCh,
          started_at: Date.now()
        })
      );
    } catch (e) {
      console.warn('Gagal menyimpan sesi baca:', e);
    }

    // Buka tab Komiku.org langsung ke chapter yang dituju
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  // Simpan progres cepat dari modal kepulangan (Quick Return Modal)
  const handleQuickSaveProgress = async (newCh) => {
    try {
      if (isAuthenticated) {
        const res = await trackerService.addToTracker({
          comic_id: id,
          reading_status: 'Sedang Dibaca',
          current_chapter: newCh
        });
        setTrackerItem(res);
      } else {
        const localItem = {
          id: `local-tracker-${id}`,
          comic_id: id,
          reading_status: 'Sedang Dibaca',
          current_chapter: newCh,
          comic
        };
        setTrackerItem(localItem);
        const existingTracker = await offlineStorage.getTracker();
        const filtered = (existingTracker || []).filter(
          (t) => t.comic_id !== id && t.comic?.id !== id
        );
        await offlineStorage.saveTracker([localItem, ...filtered]);
      }
      setTrackedChapter(newCh);
      setTrackedStatus('Sedang Dibaca');
      setToastMessage(`✓ Progres bacaan berhasil diperbarui ke Chapter ${newCh}!`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error('Gagal menyimpan progres cepat:', err);
    }
  };

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
      navigate('/login', { state: { from: location } });
      return;
    }

    if (!isOnline) {
      setTrackerError('Pembaruan progres tracker membutuhkan koneksi internet untuk sinkronisasi ke server.');
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
      setToastMessage(`✓ Progres berhasil disimpan ke Chapter ${val}!`);
      setTimeout(() => setToastMessage(null), 4000);
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
      <div className="py-12 text-center max-w-md mx-auto space-y-4">
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
          <p className="font-semibold mb-1">Gagal Membuka Komik</p>
          <p className="text-xs text-rose-700 leading-relaxed">
            {error || 'Komik tidak ditemukan.'}
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-manhwa-surface text-manhwa-text hover:bg-manhwa-highlight border border-manhwa-border transition-smooth"
        >
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  const defaultCover =
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';

  const isCompleted = comic.status === 'Completed';
  const hasReadingProgress = trackerItem && trackerItem.current_chapter > 0;

  return (
    <div className="space-y-6">
      {/* Top Bar: Tombol Kembali & Tombol Bagikan Komik */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-manhwa-muted hover:text-manhwa-text transition-smooth py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        {/* Tombol Share Link Header */}
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-manhwa-card text-manhwa-accent hover:bg-manhwa-surface border border-manhwa-border text-xs font-semibold shadow-xs transition-smooth"
          title="Bagikan Komik Ini"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Bagikan</span>
        </button>
      </div>

      {/* Indikator Status Offline */}
      {!isOnline && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-900 text-xs font-medium">
          <WifiOff className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span>
            Mode Offline: Anda sedang membaca salinan komik yang tersimpan di perangkat.
          </span>
        </div>
      )}

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

            {/* Action Buttons: Baca/Lanjutkan + Tracker + Bagikan Komik */}
            <div className="mt-6 pt-4 border-t border-manhwa-border/60 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                {/* Tombol Utama: "Baca" atau "Lanjutkan" (Trik 1) */}
                <button
                  type="button"
                  onClick={handleStartReading}
                  className="flex-grow sm:flex-grow-0 px-6 py-2.5 rounded-xl bg-manhwa-accent text-white font-semibold text-xs md:text-sm hover:bg-manhwa-accent-hover transition-smooth shadow-soft flex items-center justify-center gap-2 group cursor-pointer"
                  title={hasReadingProgress ? `Lanjut membaca Chapter ${trackerItem.current_chapter}` : 'Mulai membaca komik ini'}
                >
                  {hasReadingProgress ? (
                    <>
                      <Play className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
                      <span>Lanjutkan (Ch. {trackerItem.current_chapter})</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                      <span>Baca</span>
                    </>
                  )}
                </button>

                {/* Status Tracker & Tombol Ubah Progres */}
                {trackerItem ? (
                  <button
                    type="button"
                    onClick={() => setIsTrackerModalOpen(true)}
                    className="flex-grow sm:flex-grow-0 px-4 py-2.5 rounded-xl bg-manhwa-surface text-manhwa-text hover:bg-manhwa-highlight border border-manhwa-border font-semibold text-xs md:text-sm transition-smooth shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    <span>Ubah Progres</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate('/login', { state: { from: location } });
                      } else {
                        setIsTrackerModalOpen(true);
                      }
                    }}
                    className="flex-grow sm:flex-grow-0 px-4 py-2.5 rounded-xl bg-manhwa-surface text-manhwa-text hover:bg-manhwa-highlight border border-manhwa-border font-semibold text-xs md:text-sm transition-smooth shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <BookmarkCheck className="w-4 h-4 text-manhwa-accent" />
                    <span>Catat Progres Bacaan</span>
                  </button>
                )}

                {/* Tombol Bagikan Komik (Shopee Share Style) */}
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-manhwa-surface text-manhwa-text hover:bg-manhwa-highlight border border-manhwa-border font-semibold text-xs md:text-sm transition-smooth shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-manhwa-accent" />
                  <span>Bagikan Komik</span>
                </button>
              </div>

              {/* Status Reading Tracker Pill (jika ada) */}
              {trackerItem && (
                <div className="bg-manhwa-surface/70 px-3.5 py-2 rounded-xl border border-manhwa-border/80 flex items-center justify-between text-xs">
                  <span className="text-manhwa-muted">
                    Status: <strong className="text-manhwa-text font-semibold">{trackerItem.reading_status}</strong>
                  </span>
                  <span className="text-manhwa-muted">
                    Progres: <strong className="text-manhwa-accent font-semibold">Chapter {trackerItem.current_chapter}</strong>
                    {comic.total_chapters > 0 && ` dari ${comic.total_chapters} Ch`}
                  </span>
                </div>
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

      {/* Modal Tambahkan / Ubah Tracker Manual */}
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
              Status Bacaan
            </label>
            <select
              value={trackedStatus}
              onChange={(e) => setTrackedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs md:text-sm bg-manhwa-surface border border-manhwa-border rounded-xl text-manhwa-text focus:outline-none focus:ring-1 focus:ring-manhwa-accent"
            >
              <option value="Sedang Dibaca">Sedang Dibaca</option>
              <option value="Selesai Dibaca">Selesai Dibaca</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-manhwa-text mb-1">
              Chapter Terakhir Dibaca
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max={comic.total_chapters > 0 ? comic.total_chapters : undefined}
                value={trackedChapter}
                onChange={(e) => handleChapterChange(e.target.value)}
                placeholder="0"
                className={`w-full px-3 py-2 text-xs md:text-sm bg-manhwa-surface border rounded-xl text-manhwa-text focus:outline-none focus:ring-1 ${
                  chapterError
                    ? 'border-rose-400 focus:ring-rose-400'
                    : 'border-manhwa-border focus:ring-manhwa-accent'
                }`}
              />
              {comic.total_chapters > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-manhwa-muted">
                  / {comic.total_chapters} Ch
                </span>
              )}
            </div>
            {chapterError && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">{chapterError}</p>
            )}
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsTrackerModalOpen(false);
                setTrackerError(null);
                setChapterError(null);
              }}
              className="px-4 py-2 rounded-xl bg-manhwa-surface text-manhwa-muted hover:text-manhwa-text border border-manhwa-border text-xs font-semibold transition-smooth"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={savingTracker || Boolean(chapterError)}
              className="px-4 py-2 rounded-xl bg-manhwa-accent text-white text-xs font-semibold hover:bg-manhwa-accent-hover transition-smooth shadow-xs disabled:opacity-50"
            >
              {savingTracker ? 'Menyimpan...' : 'Simpan Progres'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Shopee-style Share Comic Modal */}
      <ShareComicModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        comic={comic}
      />

      {/* Quick Progress Return Modal (Trik 1: Muncul saat kembali dari tab bacaan) */}
      <QuickProgressModal
        isOpen={showQuickReturnModal}
        onClose={() => setShowQuickReturnModal(false)}
        comic={comic}
        currentChapter={trackerItem?.current_chapter || 0}
        onSaveProgress={handleQuickSaveProgress}
      />

      {/* Toast Notifikasi Berhasil */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-manhwa-text text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-elevated flex items-center gap-2 animate-fadeIn border border-manhwa-border">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

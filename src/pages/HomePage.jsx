import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Filter, X, BookOpen, Layers, WifiOff } from 'lucide-react';
import { comicService } from '../services/comicService';
import { genreService } from '../services/genreService';
import { ComicCard } from '../components/ComicCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { useAuth } from '../hooks/useAuth';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const HomePage = () => {
  const { user } = useAuth();
  const isOnline = useOnlineStatus();

  const [comics, setComics] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [comicsData, genresData] = await Promise.all([
          comicService.getAll(),
          genreService.getAll()
        ]);

        setComics(comicsData);
        setGenres(genresData);
      } catch (err) {
        console.error('Error saat memuat beranda:', err);
        setError(
          isOnline
            ? 'Gagal memuat katalog komik. Pastikan server backend telah aktif.'
            : 'Anda sedang offline dan katalog komik belum pernah tersimpan di cache perangkat.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOnline]);

  // Filter comics locally based on search, genre, and status
  const filteredComics = comics.filter((comic) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = comic.title?.toLowerCase().includes(q);
      const matchAlt = comic.alternative_title?.toLowerCase().includes(q);
      const matchAuthor = comic.author?.toLowerCase().includes(q);
      if (!matchTitle && !matchAlt && !matchAuthor) return false;
    }

    // Genre
    if (selectedGenre) {
      const hasGenre = comic.genres?.some(
        (g) => g.name.toLowerCase() === selectedGenre.toLowerCase() || g.id === selectedGenre
      );
      if (!hasGenre) return false;
    }

    // Status
    if (selectedStatus && comic.status !== selectedStatus) {
      return false;
    }

    return true;
  });

  // Featured / Curated Picks (hingga 6 komik untuk tampilan proporsional di desktop)
  const featuredComics = comics.slice(0, 6);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('');
    setSelectedStatus('');
  };

  const hasActiveFilters = Boolean(searchQuery || selectedGenre || selectedStatus);

  return (
    <div className="space-y-6">
      {/* Banner Mode Offline */}
      {!isOnline && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-900 text-xs font-medium">
          <WifiOff className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span>
            Mode Offline: Menampilkan {comics.length} judul komik yang tersimpan di memori perangkat. Anda tetap dapat mencari dan melihat detailnya.
          </span>
        </div>
      )}

      {/* Sapaan Hangat & Greeting */}
      <section className="bg-manhwa-card rounded-2xl border border-manhwa-border p-5 md:p-7 shadow-soft">
        <div className="max-w-4xl">
          <span className="text-xs md:text-sm font-semibold tracking-wider uppercase text-manhwa-secondary">
            Katalog Perpustakaan Komik
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-serif text-manhwa-text mt-1.5 leading-tight">
            {user ? `Selamat Datang, ${user.name}` : 'Temukan Cerita Favoritmu'}
          </h2>
          <p className="text-sm md:text-base text-manhwa-muted mt-2 leading-relaxed">
            Jelajahi beragam judul manhwa dan manhua pilihan, kenali profil karakter utama, dan pantau progres bacaan Anda setiap saat.
          </p>
        </div>

        {/* Kolom Pencarian */}
        <div className="mt-5 relative">
          <Search className="w-5 h-5 text-manhwa-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan judul komik atau penulis..."
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-manhwa-surface text-manhwa-text placeholder:text-manhwa-muted/70 text-sm md:text-base border border-manhwa-border focus:outline-none focus:border-manhwa-accent transition-smooth"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-manhwa-muted hover:text-manhwa-text p-1 cursor-pointer"
              aria-label="Hapus Pencarian"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filter Genre & Status */}
        <div className="mt-5 pt-4 border-t border-manhwa-border/60 flex flex-col gap-3">
          {/* Genre Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs md:text-sm font-semibold text-manhwa-muted mr-1 flex items-center gap-1.5 flex-shrink-0">
              <Filter className="w-3.5 h-3.5" /> Genre:
            </span>
            <button
              onClick={() => setSelectedGenre('')}
              className={`text-xs md:text-sm px-3.5 py-1.5 rounded-full border transition-smooth flex-shrink-0 cursor-pointer ${
                selectedGenre === ''
                  ? 'bg-manhwa-accent text-white border-manhwa-accent font-semibold'
                  : 'bg-manhwa-surface text-manhwa-muted border-manhwa-border hover:text-manhwa-text'
              }`}
            >
              Semua
            </button>
            {genres.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGenre(selectedGenre === g.name ? '' : g.name)}
                className={`text-xs md:text-sm px-3.5 py-1.5 rounded-full border transition-smooth flex-shrink-0 cursor-pointer ${
                  selectedGenre === g.name
                    ? 'bg-manhwa-accent text-white border-manhwa-accent font-semibold'
                    : 'bg-manhwa-surface text-manhwa-muted border-manhwa-border hover:text-manhwa-text'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2.5 text-xs md:text-sm">
            <span className="text-xs md:text-sm font-semibold text-manhwa-muted">Status:</span>
            {['', 'Ongoing', 'Completed'].map((status) => {
              const label = status === '' ? 'Semua' : status === 'Completed' ? 'Tamat' : 'Ongoing';
              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`text-xs md:text-sm px-3 py-1 rounded-lg border transition-smooth cursor-pointer ${
                    selectedStatus === status
                      ? 'bg-manhwa-secondary text-white border-manhwa-secondary font-semibold'
                      : 'bg-manhwa-card text-manhwa-muted border-manhwa-border hover:text-manhwa-text'
                  }`}
                >
                  {label}
                </button>
              );
            })}

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="ml-auto text-xs md:text-sm text-manhwa-accent hover:underline font-semibold cursor-pointer"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Bagian Rekomendasi Pilihan Redaksi (Hanya jika belum filter) */}
      {!hasActiveFilters && featuredComics.length > 0 && (
        <section className="space-y-3.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-manhwa-accent" />
            <h3 className="font-serif font-bold text-lg md:text-xl text-manhwa-text">
              Rekomendasi Pilihan
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 md:gap-5">
            {featuredComics.map((comic) => (
              <ComicCard key={`featured-${comic.id}`} comic={comic} />
            ))}
          </div>
        </section>
      )}

      {/* Daftar Seluruh Komik */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-manhwa-secondary" />
            <h3 className="font-serif font-bold text-lg md:text-xl text-manhwa-text">
              {hasActiveFilters ? 'Hasil Pencarian Komik' : 'Seluruh Komik'}
            </h3>
          </div>
          <span className="text-xs md:text-sm text-manhwa-muted">
            {filteredComics.length} Judul Tersedia
          </span>
        </div>

        {/* State Display */}
        {loading ? (
          <LoadingSpinner message="Menyiapkan daftar komik..." />
        ) : error ? (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {error}
          </div>
        ) : filteredComics.length === 0 ? (
          <EmptyState
            title="Tidak Ada Komik yang Cocok"
            description="Tidak ada judul komik yang sesuai dengan kata kunci pencarian atau filter yang dipilih."
            actionLabel="Reset Pencarian"
            onAction={resetFilters}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3.5 sm:gap-4 md:gap-5">
            {filteredComics.map((comic) => (
              <ComicCard key={comic.id} comic={comic} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Search, Users, Filter, X, WifiOff } from 'lucide-react';
import { characterService } from '../services/characterService';
import { CharacterCard } from '../components/CharacterCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const CharactersPage = () => {
  const isOnline = useOnlineStatus();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Role Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const roles = [
    'Protagonis Utama',
    'Tokoh Utama Pria',
    'Antagonis',
    'Karakter Pendukung'
  ];

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await characterService.getAll();
        setCharacters(data);
      } catch (err) {
        console.error('Error saat memuat karakter:', err);
        setError(
          isOnline
            ? 'Gagal memuat daftar karakter. Silakan coba beberapa saat lagi.'
            : 'Anda sedang offline dan daftar karakter belum tersimpan di cache perangkat.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [isOnline]);

  const filteredCharacters = characters.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name?.toLowerCase().includes(q);
      const matchComic = c.comic_title?.toLowerCase().includes(q);
      const matchDesc = c.description?.toLowerCase().includes(q);
      if (!matchName && !matchComic && !matchDesc) return false;
    }

    if (selectedRole && c.role?.toLowerCase() !== selectedRole.toLowerCase()) {
      return false;
    }

    return true;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedRole('');
  };

  return (
    <div className="space-y-6">
      {/* Banner Mode Offline */}
      {!isOnline && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-900 text-xs font-medium">
          <WifiOff className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span>
            Mode Offline: Menampilkan {characters.length} profil karakter yang tersimpan di perangkat.
          </span>
        </div>
      )}

      {/* Header Halaman */}
      <section className="bg-manhwa-card rounded-2xl border border-manhwa-border p-5 md:p-7 shadow-soft">
        <div className="max-w-4xl">
          <span className="text-xs md:text-sm font-semibold tracking-wider uppercase text-manhwa-secondary">
            Ensiklopedia Tokoh
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-serif text-manhwa-text mt-1.5 leading-tight">
            Daftar Karakter Komik
          </h2>
          <p className="text-sm md:text-base text-manhwa-muted mt-2 leading-relaxed">
            Kenali profil lengkap para protagonis, tokoh utama pria, hingga dalang antagonis di balik kisah manhwa legendaris.
          </p>
        </div>

        {/* Pencarian Karakter */}
        <div className="mt-5 relative">
          <Search className="w-5 h-5 text-manhwa-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama karakter atau judul komik..."
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

        {/* Filter Role */}
        <div className="mt-4 pt-3.5 border-t border-manhwa-border/60 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs md:text-sm font-semibold text-manhwa-muted mr-1 flex items-center gap-1.5 flex-shrink-0">
            <Filter className="w-3.5 h-3.5" /> Peran:
          </span>
          <button
            onClick={() => setSelectedRole('')}
            className={`text-xs md:text-sm px-3.5 py-1.5 rounded-full border transition-smooth flex-shrink-0 cursor-pointer ${
              selectedRole === ''
                ? 'bg-manhwa-accent text-white border-manhwa-accent font-semibold'
                : 'bg-manhwa-surface text-manhwa-muted border-manhwa-border hover:text-manhwa-text'
            }`}
          >
            Semua
          </button>
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRole(selectedRole === r ? '' : r)}
              className={`text-xs md:text-sm px-3.5 py-1.5 rounded-full border transition-smooth flex-shrink-0 cursor-pointer ${
                selectedRole === r
                  ? 'bg-manhwa-accent text-white border-manhwa-accent font-semibold'
                  : 'bg-manhwa-surface text-manhwa-muted border-manhwa-border hover:text-manhwa-text'
              }`}
            >
              {r}
            </button>
          ))}
          {(searchQuery || selectedRole) && (
            <button
              onClick={resetFilters}
              className="ml-auto text-xs md:text-sm text-manhwa-accent hover:underline flex-shrink-0 font-semibold cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </section>

      {/* Grid Karakter */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-manhwa-secondary" />
            <h3 className="font-serif font-bold text-base md:text-lg text-manhwa-text">
              Daftar Tokoh ({filteredCharacters.length})
            </h3>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Menyiapkan data karakter..." />
        ) : error ? (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {error}
          </div>
        ) : filteredCharacters.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Karakter Tidak Ditemukan"
            description="Tidak ada karakter yang cocok dengan kriteria pencarian Anda."
            actionLabel="Reset Pencarian"
            onAction={resetFilters}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3.5 sm:gap-4 md:gap-5">
            {filteredCharacters.map((char) => (
              <CharacterCard key={char.id} character={char} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

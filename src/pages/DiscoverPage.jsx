import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import { comicService } from '../services/comicService';
import { ComicCard } from '../components/ComicCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';

export const DiscoverPage = () => {
  const [selectedGenre, setSelectedGenre] = useState('Historical');
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const focusGenres = [
    {
      name: 'Historical',
      tagline: 'Kemegahan Istana & Dinasti Masa Silam',
      desc: 'Konspirasi kerajaan bangsawan, politik istana, dan intrik kaisar yang megah.',
      color: 'bg-amber-900/10 text-amber-900 border-amber-900/20'
    },
    {
      name: 'Thriller',
      tagline: 'Ketegangan Penuh Misteri Psikologis',
      desc: 'Plot twist tak terduga, investigasi kejahatan, dan atmosfer mencekam.',
      color: 'bg-stone-900/10 text-stone-900 border-stone-900/20'
    },
    {
      name: 'Time Travel',
      tagline: 'Peluang Kedua Memutar Jarum Jam',
      desc: 'Regresi waktu, reinkarnasi, dan mengubah takdir masa depan.',
      color: 'bg-indigo-900/10 text-indigo-900 border-indigo-900/20'
    },
    {
      name: 'Romance',
      tagline: 'Kisah Kasih Menghangatkan Jiwa',
      desc: 'Hubungan emosional mendalam di antara takdir, cinta, dan pengorbanan.',
      color: 'bg-rose-900/10 text-rose-900 border-rose-900/20'
    },
    {
      name: 'Fantasy',
      tagline: 'Dunia Sihir, Mantra, & Monster',
      desc: 'Petualangan sihir menembus batasan nalar melintasi dimensi asing.',
      color: 'bg-emerald-900/10 text-emerald-900 border-emerald-900/20'
    },
    {
      name: 'Action',
      tagline: 'Aksi Tempur & Pertarungan Epik',
      desc: 'Seni bela diri, pertempuran dungeon, dan peningkatan kekuatan karakter.',
      color: 'bg-orange-900/10 text-orange-900 border-orange-900/20'
    }
  ];

  useEffect(() => {
    const fetchGenreComics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await comicService.getAll({ genre: selectedGenre });
        setComics(data);
      } catch (err) {
        console.error('Error saat memuat rekomendasi:', err);
        setError('Gagal memuat rekomendasi genre.');
      } finally {
        setLoading(false);
      }
    };

    fetchGenreComics();
  }, [selectedGenre]);

  const activeGenreInfo = focusGenres.find((g) => g.name === selectedGenre) || focusGenres[0];

  return (
    <div className="space-y-6">
      {/* Header Temukan */}
      <section className="bg-manhwa-card rounded-2xl border border-manhwa-border p-5 md:p-7 shadow-soft">
        <div className="max-w-4xl">
          <span className="text-xs md:text-sm font-semibold tracking-wider uppercase text-manhwa-secondary">
            Eksplorasi Katalog
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-serif text-manhwa-text mt-1.5 leading-tight">
            Temukan Berdasarkan Genre
          </h2>
          <p className="text-sm md:text-base text-manhwa-muted mt-2 leading-relaxed">
            Pilih genre favorit Anda untuk menemukan judul-judul manhwa terbaik yang dikurasi khusus untuk pengalaman membaca mendalam.
          </p>
        </div>

        {/* 6 Genre Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5">
          {focusGenres.map((genre) => {
            const isSelected = selectedGenre === genre.name;
            return (
              <button
                key={genre.name}
                onClick={() => setSelectedGenre(genre.name)}
                className={`p-3.5 rounded-xl border text-left transition-smooth flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-manhwa-accent text-white border-manhwa-accent shadow-soft'
                    : 'bg-manhwa-surface text-manhwa-text border-manhwa-border hover:bg-manhwa-highlight'
                }`}
              >
                <div>
                  <h4
                    className={`font-serif font-bold text-base ${
                      isSelected ? 'text-white' : 'text-manhwa-text'
                    }`}
                  >
                    {genre.name}
                  </h4>
                  <p
                    className={`text-xs mt-1 line-clamp-1 ${
                      isSelected ? 'text-white/85' : 'text-manhwa-muted'
                    }`}
                  >
                    {genre.tagline}
                  </p>
                </div>
                <div
                  className={`mt-3 flex items-center gap-1 text-xs font-semibold ${
                    isSelected ? 'text-white' : 'text-manhwa-accent'
                  }`}
                >
                  <span>Lihat Judul</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Bagian Komik Berdasarkan Genre Terpilih */}
      <section className="space-y-3.5">
        <div className="bg-manhwa-card rounded-xl border border-manhwa-border p-4 md:p-5 shadow-soft">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-manhwa-accent" />
            <h3 className="font-serif font-bold text-lg md:text-xl text-manhwa-text">
              Koleksi Genre: {activeGenreInfo.name}
            </h3>
          </div>
          <p className="text-xs md:text-sm text-manhwa-muted mt-1.5 leading-relaxed">
            {activeGenreInfo.desc}
          </p>
        </div>

        {loading ? (
          <LoadingSpinner message={`Mencari komik bergenre ${selectedGenre}...`} />
        ) : error ? (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {error}
          </div>
        ) : comics.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title={`Belum Ada Komik ${selectedGenre}`}
            description={`Saat ini belum ada judul komik yang terdaftar pada genre ${selectedGenre}. Admin dapat menambahkannya melalui panel katalog.`}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3.5 sm:gap-4 md:gap-5">
            {comics.map((comic) => (
              <ComicCard key={comic.id} comic={comic} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

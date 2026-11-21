import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Shield, Sparkles } from 'lucide-react';
import { characterService } from '../services/characterService';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const CharacterDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchCharacterDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await characterService.getById(id);
        setCharacter(data);
      } catch (err) {
        console.error('Error saat memuat karakter:', err);
        setError('Gagal memuat profil karakter.');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacterDetail();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Menyiapkan profil karakter..." />;
  }

  if (error || !character) {
    return (
      <div className="py-12 text-center max-w-md mx-auto">
        <p className="text-sm text-rose-800 bg-rose-50 p-4 rounded-xl border border-rose-200">
          {error || 'Karakter tidak ditemukan.'}
        </p>
        <button
          onClick={() => navigate('/characters')}
          className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-manhwa-surface text-manhwa-text hover:bg-manhwa-highlight border border-manhwa-border transition-smooth"
        >
          Kembali ke Daftar Karakter
        </button>
      </div>
    );
  }

  const defaultPhoto =
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'protagonis utama':
        return 'bg-manhwa-accent/15 text-manhwa-accent border-manhwa-accent/30';
      case 'tokoh utama pria':
        return 'bg-blue-900/10 text-blue-900 border-blue-900/25';
      case 'antagonis':
        return 'bg-rose-900/10 text-rose-900 border-rose-900/25';
      default:
        return 'bg-manhwa-surface text-manhwa-muted border-manhwa-border';
    }
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      {/* Tombol Kembali */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-manhwa-muted hover:text-manhwa-text transition-smooth py-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali</span>
      </button>

      {/* Hero Profil Karakter */}
      <section className="bg-manhwa-card rounded-2xl border border-manhwa-border p-5 md:p-6 shadow-soft">
        <div className="flex flex-col sm:flex-row gap-5 md:gap-6 items-start">
          {/* Portrait Image */}
          <div className="w-full sm:w-56 md:w-64 aspect-[4/5] rounded-xl overflow-hidden bg-manhwa-surface border border-manhwa-border flex-shrink-0 relative shadow-soft">
            <img
              src={!imageError && character.image_url ? character.image_url : defaultPhoto}
              alt={character.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details Header */}
          <div className="flex-grow space-y-3.5">
            <div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full border inline-block ${getRoleBadgeColor(
                  character.role
                )}`}
              >
                {character.role}
              </span>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-manhwa-text mt-2 leading-tight">
                {character.name}
              </h1>
            </div>

            {/* Asal Komik */}
            {character.comic_title && (
              <div className="bg-manhwa-surface rounded-xl p-3.5 border border-manhwa-border flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-manhwa-muted uppercase font-medium block">
                    Asal Judul Komik
                  </span>
                  <p className="font-serif font-bold text-base md:text-lg text-manhwa-text mt-0.5">
                    {character.comic_title}
                  </p>
                </div>
                {character.comic_id && (
                  <Link
                    to={`/comics/${character.comic_id}`}
                    className="text-xs md:text-sm font-semibold px-3.5 py-1.5 rounded-lg bg-manhwa-card text-manhwa-accent border border-manhwa-border hover:bg-manhwa-highlight transition-smooth whitespace-nowrap cursor-pointer"
                  >
                    Buka Komik
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Latar Belakang & Deskripsi Karakter */}
        <div className="mt-6 pt-5 border-t border-manhwa-border/70 space-y-5">
          {/* Latar Belakang */}
          <div>
            <h3 className="font-serif font-bold text-base md:text-lg text-manhwa-text mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-manhwa-accent" />
              <span>Latar Belakang Karakter</span>
            </h3>
            <p className="text-sm md:text-base text-manhwa-muted leading-relaxed whitespace-pre-line bg-manhwa-surface/50 p-4 rounded-xl border border-manhwa-border/60">
              {character.background || 'Latar belakang belum didokumentasikan.'}
            </p>
          </div>

          {/* Karakteristik & Kepribadian */}
          <div>
            <h3 className="font-serif font-bold text-base md:text-lg text-manhwa-text mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-manhwa-secondary" />
              <span>Deskripsi & Sifat Tokoh</span>
            </h3>
            <p className="text-sm md:text-base text-manhwa-muted leading-relaxed whitespace-pre-line bg-manhwa-surface/50 p-4 rounded-xl border border-manhwa-border/60">
              {character.description || 'Deskripsi sifat belum didokumentasikan.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

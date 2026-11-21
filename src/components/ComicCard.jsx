import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Layers } from 'lucide-react';

export const ComicCard = ({ comic }) => {
  const [imageError, setImageError] = useState(false);

  const defaultCover =
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';

  const statusLabel = comic.status === 'Completed' ? 'Tamat' : 'Ongoing';
  const isCompleted = comic.status === 'Completed';

  return (
    <Link
      to={`/comics/${comic.id}`}
      className="group flex flex-col h-full bg-manhwa-card rounded-xl border border-manhwa-border overflow-hidden shadow-soft hover:shadow-elevated transition-smooth hover:-translate-y-0.5"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[3/4] w-full bg-manhwa-surface overflow-hidden">
        <img
          src={!imageError && comic.cover_url ? comic.cover_url : defaultCover}
          alt={comic.title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-smooth duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Status Pill */}
        <div className="absolute top-2.5 right-2.5">
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-sm border ${
              isCompleted
                ? 'bg-emerald-800/85 text-emerald-100 border-emerald-600/40'
                : 'bg-manhwa-card/90 text-manhwa-accent border-manhwa-border'
            }`}
          >
            {statusLabel}
          </span>
        </div>

        {/* Total Chapters Badge */}
        {comic.total_chapters > 0 && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md bg-manhwa-text/80 text-white backdrop-blur-sm">
            <Layers className="w-3.5 h-3.5" />
            <span>{comic.total_chapters} Ch</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5 md:p-4 flex flex-col flex-grow justify-between">
        <div>
          {/* Genre Tags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {comic.genres && comic.genres.slice(0, 2).map((genre) => (
              <span
                key={genre.id || genre.name}
                className="text-xs font-medium px-2 py-0.5 rounded bg-manhwa-surface text-manhwa-muted border border-manhwa-border/60"
              >
                {genre.name}
              </span>
            ))}
            {comic.genres && comic.genres.length > 2 && (
              <span className="text-xs text-manhwa-muted self-center">
                +{comic.genres.length - 2}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-serif font-bold text-base md:text-lg text-manhwa-text group-hover:text-manhwa-accent transition-smooth line-clamp-2 leading-snug">
            {comic.title}
          </h3>
        </div>

        {/* Author */}
        {comic.author && (
          <p className="text-xs md:text-sm text-manhwa-muted mt-2.5 line-clamp-1 border-t border-manhwa-border/50 pt-2">
            oleh {comic.author}
          </p>
        )}
      </div>
    </Link>
  );
};

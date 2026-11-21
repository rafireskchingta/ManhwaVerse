import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export const CharacterCard = ({ character }) => {
  const [imageError, setImageError] = useState(false);

  const defaultPhoto =
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'protagonis utama':
        return 'bg-manhwa-accent/10 text-manhwa-accent border-manhwa-accent/25';
      case 'tokoh utama pria':
        return 'bg-blue-900/10 text-blue-800 border-blue-900/20';
      case 'antagonis':
        return 'bg-rose-900/10 text-rose-800 border-rose-900/20';
      default:
        return 'bg-manhwa-surface text-manhwa-muted border-manhwa-border';
    }
  };

  return (
    <Link
      to={`/characters/${character.id}`}
      className="group flex flex-col h-full bg-manhwa-card rounded-xl border border-manhwa-border overflow-hidden shadow-soft hover:shadow-elevated transition-smooth hover:-translate-y-0.5"
    >
      {/* Portrait Image Container */}
      <div className="relative aspect-[4/5] w-full bg-manhwa-surface overflow-hidden">
        <img
          src={!imageError && character.image_url ? character.image_url : defaultPhoto}
          alt={character.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-smooth duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Role Pill */}
        <div className="absolute top-2.5 left-2.5">
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-xs border ${getRoleBadgeColor(
              character.role
            )}`}
          >
            {character.role}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 md:p-4 flex flex-col flex-grow">
        <h3 className="font-serif font-bold text-base md:text-lg text-manhwa-text group-hover:text-manhwa-accent transition-smooth line-clamp-1 leading-snug">
          {character.name}
        </h3>

        {/* Origin Comic */}
        {character.comic_title && (
          <div className="flex items-center gap-1.5 mt-1.5 text-xs md:text-sm text-manhwa-muted line-clamp-1">
            <BookOpen className="w-3.5 h-3.5 flex-shrink-0 text-manhwa-secondary" />
            <span className="truncate">{character.comic_title}</span>
          </div>
        )}

        {/* Short description preview */}
        {character.description && (
          <p className="text-xs md:text-sm text-manhwa-muted/80 mt-2 line-clamp-2 leading-relaxed">
            {character.description}
          </p>
        )}
      </div>
    </Link>
  );
};

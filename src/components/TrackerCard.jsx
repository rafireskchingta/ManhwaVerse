import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, CheckCircle2, BookOpen } from 'lucide-react';

export const TrackerCard = ({ item, onUpdateProgress, onDelete }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [imageError, setImageError] = useState(false);

  const comic = item.comic || {};
  const current = item.current_chapter || 0;
  const total = comic.total_chapters || 0;
  const progressPercent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
  const isCompleted = item.reading_status === 'Selesai Dibaca';

  const defaultCover =
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';

  const handleQuickIncrement = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUpdating) return;

    try {
      setIsUpdating(true);
      const nextChapter = current + 1;
      const nextStatus =
        total > 0 && nextChapter >= total ? 'Selesai Dibaca' : item.reading_status;

      await onUpdateProgress(item.id, {
        current_chapter: nextChapter,
        reading_status: nextStatus
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-manhwa-card rounded-xl border border-manhwa-border p-3.5 shadow-soft transition-smooth hover:shadow-elevated flex gap-3.5">
      {/* Comic Thumbnail */}
      <Link
        to={`/comics/${comic.id}`}
        className="w-20 aspect-[3/4] rounded-lg overflow-hidden bg-manhwa-surface flex-shrink-0 border border-manhwa-border/80 group"
      >
        <img
          src={!imageError && comic.cover_url ? comic.cover_url : defaultCover}
          alt={comic.title || 'Cover'}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-smooth group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      {/* Info & Controls */}
      <div className="flex flex-col justify-between flex-grow min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              to={`/comics/${comic.id}`}
              className="font-serif font-bold text-base md:text-lg text-manhwa-text hover:text-manhwa-accent transition-smooth line-clamp-1"
            >
              {comic.title || 'Judul Komik'}
            </Link>

            {/* Status Pill */}
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded-full border flex-shrink-0 ${
                isCompleted
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              {item.reading_status}
            </span>
          </div>

          {/* Chapter Reading Status */}
          <div className="mt-1.5 flex items-center justify-between text-xs md:text-sm text-manhwa-muted">
            <span>
              Chapter <strong className="text-manhwa-text font-serif text-sm md:text-base">{current}</strong>
              {total > 0 && <span> / {total}</span>}
            </span>
            {total > 0 && (
              <span className="text-xs font-semibold text-manhwa-secondary">
                {progressPercent}%
              </span>
            )}
          </div>

          {/* Progress Bar */}
          {total > 0 && (
            <div className="w-full bg-manhwa-surface h-2 rounded-full overflow-hidden mt-2 border border-manhwa-border/50">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isCompleted ? 'bg-emerald-600' : 'bg-manhwa-accent'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-3.5 pt-2.5 border-t border-manhwa-border/60">
          <div className="flex items-center gap-2">
            {/* Quick +1 Chapter */}
            <button
              onClick={handleQuickIncrement}
              disabled={isUpdating || (total > 0 && current >= total)}
              title="Tambah 1 Chapter"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-semibold rounded-lg bg-manhwa-surface text-manhwa-accent hover:bg-manhwa-highlight border border-manhwa-border transition-smooth disabled:opacity-50 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+1 Ch</span>
            </button>

            {/* Edit Progress Button */}
            <button
              onClick={() => onUpdateProgress(item)}
              title="Ubah Progres Bacaan"
              className="p-1.5 rounded-lg text-manhwa-muted hover:text-manhwa-text hover:bg-manhwa-surface transition-smooth cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(item.id, comic.title)}
            title="Hapus dari Bacaan"
            className="p-1.5 rounded-lg text-manhwa-muted hover:text-rose-700 hover:bg-rose-50 transition-smooth"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

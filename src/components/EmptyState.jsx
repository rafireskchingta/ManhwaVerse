import React from 'react';
import { BookX } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = BookX,
  title = 'Belum Ada Data',
  description = 'Data yang Anda cari tidak ditemukan atau belum ditambahkan.',
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-manhwa-card rounded-2xl border border-manhwa-border/80 my-4 shadow-soft">
      <div className="w-14 h-14 rounded-2xl bg-manhwa-surface flex items-center justify-center text-manhwa-muted mb-4 border border-manhwa-border">
        <Icon className="w-7 h-7 stroke-[1.5]" />
      </div>

      <h3 className="font-serif font-bold text-base text-manhwa-text">
        {title}
      </h3>

      <p className="text-xs text-manhwa-muted mt-1.5 max-w-sm leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-manhwa-accent text-white hover:bg-manhwa-accent-hover transition-smooth shadow-xs"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
